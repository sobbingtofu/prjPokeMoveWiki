import {DB_NAME_KOREAN_MOVES, DB_VERSION, EXPIRE_MS, META_STORE, STORE_NAME_KOREAN_MOVES} from "@/store/constantStore";
import {getDBMeta, getFromDB, openDB, saveToDB} from "../indexedDBLogics/indexedDBLogics";
import {initialMovesType, initialPokemonType, koreanMoveType} from "./type";
import {generateKoreanMoveData} from "./fetchMovePokemonLogics";
import {detailedPokemInfoType} from "@/store/type";

interface FetchMovesResult {
  successMoves: koreanMoveType[];
  failedInitialMoves: initialMovesType[];
}

// 맨 처음 fetch => 성공/실패 결과를 분리해 저장
// 성공한 애들은 DB 저장 및 zustand 상태 업데이트
// 실패한 애들에 대해선 아래 재시도 함수 적용
const fetchKoreanMovesOnce = async (initialMovesParam: initialMovesType[]): Promise<FetchMovesResult> => {
  const successMoves: koreanMoveType[] = [];
  const failedInitialMoves: initialMovesType[] = [];

  // 각 기술에 대해 개별적으로 처리
  const promises = initialMovesParam.map(async (moveItem) => {
    try {
      // generateKoreanMoveData는 배열을 받으므로 단일 요소 배열로 전달
      const result: koreanMoveType[] = await generateKoreanMoveData([moveItem]);

      if (result && result.length > 0) {
        return {success: true, move: result[0], originalItem: moveItem};
      } else {
        return {success: false, move: null, originalItem: moveItem};
      }
    } catch (error) {
      console.error(`기술 ${moveItem.name} 처리 실패:`, error);
      return {success: false, move: null, originalItem: moveItem};
    }
  });

  // Promise.allSettled로 모든 결과 수집, 일부 실패해도 계속 진행!
  const results = await Promise.allSettled(promises);

  results.forEach((result) => {
    if (result.status === "fulfilled") {
      if (result.value.success && result.value.move) {
        successMoves.push(result.value.move);
      } else {
        failedInitialMoves.push(result.value.originalItem);
      }
    } else {
      console.error("Promise rejected:", result.reason);
    }
  });

  return {successMoves, failedInitialMoves};
};

// 재시도 fetch 함수 - DB 저장 및 상태 업데이트 콜백 포함
const fetchKoreanMovesWithRetry = async (
  initialMovesParam: initialMovesType[],
  onSuccessBatch: (moves: koreanMoveType[]) => Promise<void>,
  maxRetries: number = 5
): Promise<void> => {
  let failedMoves: initialMovesType[] = initialMovesParam;
  let retryCount = 0;

  // 최초 시도
  console.log(`최초 시도: ${failedMoves.length}개 기술 처리 중...`);
  const firstResult = await fetchKoreanMovesOnce(failedMoves);

  if (firstResult.successMoves.length > 0) {
    console.log(`최초 시도 성공: ${firstResult.successMoves.length}개`);
    await onSuccessBatch(firstResult.successMoves);
  }

  failedMoves = firstResult.failedInitialMoves;
  console.log(`최초 시도 실패: ${failedMoves.length}개`);

  // 재시도 루프
  while (failedMoves.length > 0 && retryCount < maxRetries) {
    retryCount++;

    // 재시도 전 대기 (exponential backoff)
    const waitTime = Math.min(500 * Math.pow(2, retryCount), 10000);
    console.log(`${waitTime}ms 대기 후 재시도 ${retryCount}/${maxRetries}...`);
    await new Promise((resolve) => setTimeout(resolve, waitTime));

    console.log(`재시도 ${retryCount}/${maxRetries}: ${failedMoves.length}개 기술 처리 중...`);

    const result = await fetchKoreanMovesOnce(failedMoves);

    if (result.successMoves.length > 0) {
      console.log(`재시도 ${retryCount} 성공: ${result.successMoves.length}개`);
      await onSuccessBatch(result.successMoves);
    }

    failedMoves = result.failedInitialMoves;
    console.log(`재시도 ${retryCount} 실패: ${failedMoves.length}개`);
  }

  if (failedMoves.length > 0) {
    console.warn(
      `최대 재시도 횟수 도달. ${failedMoves.length}개 기술 처리 최종 실패:`,
      failedMoves.map((m) => m.name)
    );
  } else {
    console.log(`모든 기술 처리 완료!`);
  }
};

export const fetchAndStoreKoreanMoves = async (
  initialMovesParam: initialMovesType[],
  onProgressUpdate?: (currentMoves: koreanMoveType[]) => void
) => {
  const db = await openDB(DB_NAME_KOREAN_MOVES, DB_VERSION, STORE_NAME_KOREAN_MOVES, META_STORE, "id");

  const meta = await getDBMeta(db, META_STORE);
  const now = Date.now();

  if (meta && now - meta.addedAt <= EXPIRE_MS) {
    console.log("IndexedDB에서 기술 데이터 가져오기");
    return await getFromDB(db, STORE_NAME_KOREAN_MOVES);
  }

  console.log("API에서 기술 데이터 가져오기 (재시도 로직 포함)");

  let allMoves: koreanMoveType[] = [];

  // 각 성공 배치마다 DB 저장 및 상태 업데이트
  const handleSuccessBatch = async (newMoves: koreanMoveType[]) => {
    // 1. 기존 DB 데이터 가져오기
    const existingMoves = await getFromDB(db, STORE_NAME_KOREAN_MOVES);

    // 2. 새로운 기술 데이터 누적
    allMoves = [...allMoves, ...newMoves];
    const combinedMoves = [...existingMoves, ...newMoves];

    // 3. DB에 누적 저장 (기존 데이터 + 새 데이터)
    console.log(`DB에 ${newMoves.length}개 기술 데이터 추가 저장 (총 ${combinedMoves.length}개)`);
    await saveToDB(db, combinedMoves, STORE_NAME_KOREAN_MOVES, META_STORE);

    // 4. 상태 업데이트 콜백 호출 (외부에서 Zustand 상태 업데이트)
    if (onProgressUpdate) {
      onProgressUpdate(combinedMoves);
    }
  };

  // 재시도 로직 실행
  await fetchKoreanMovesWithRetry(initialMovesParam, handleSuccessBatch);

  // 최종 데이터 반환
  const finalMoves = await getFromDB(db, STORE_NAME_KOREAN_MOVES);
  return finalMoves;
};
