"use client";

import {useQuery} from "@tanstack/react-query";
import {getInitialMoveData, generateKoreanMoveData} from "@/logic/pokeapiLogics/fetchMovePokemonLogics";
import {useZustandStore} from "@/store/zustandStore";
import {useEffect, useRef} from "react";
import {getDBMeta, getFromDB, openDB, saveToDB} from "@/logic/indexedDBLogics/indexedDBLogics";
import {DB_NAME_KOREAN_MOVES, DB_VERSION, EXPIRE_MS, META_STORE, STORE_NAME_KOREAN_MOVES} from "@/store/constantStore";

export const useLoadData_KoreanMovesArr = () => {
  const setLoadingStates = useZustandStore((state) => state.setLoadingStates);
  const setKoreanMovesArrayStates = useZustandStore((state) => state.setKoreanMovesArrayStates);

  // 초기 기술 데이터 쿼리
  const {data: initialMoves, isLoading: isInitialMovesLoading} = useQuery({
    queryKey: ["initialMoves"],
    queryFn: getInitialMoveData,
    staleTime: Infinity,
    gcTime: Infinity,
  });

  // 한국어 기술 데이터 쿼리 (initialMoves에 의존)
  const {
    data: koreanMoves,
    isLoading: isKoreanMovesLoading,
    refetch: refetchKoreanMoves,
  } = useQuery({
    queryKey: ["koreanMoves", initialMoves?.length],
    queryFn: () => generateKoreanMoveData(initialMoves!),
    enabled: false, // 직접 실행
    staleTime: Infinity,
    gcTime: Infinity,
  });

  const didRunRef = useRef(false);

  useEffect(() => {
    if (!initialMoves || didRunRef.current) return;
    didRunRef.current = true;

    (async () => {
      const db = await openDB(DB_NAME_KOREAN_MOVES, DB_VERSION, STORE_NAME_KOREAN_MOVES, META_STORE);
      const meta = await getDBMeta(db, META_STORE);

      if (!meta) {
        // 1. DB가 없으면 쿼리 실행 후 저장
        const {data: moves} = await refetchKoreanMoves();
        if (moves) {
          await saveToDB(db, moves, STORE_NAME_KOREAN_MOVES, META_STORE);
          setKoreanMovesArrayStates(moves);
        }
      } else {
        // 3, 4. DB가 있으면 시간 확인
        const now = Date.now();
        if (now - meta.addedAt > EXPIRE_MS) {
          // 3. 24시간 지났으면 쿼리 실행 후 덮어쓰기
          const {data: moves} = await refetchKoreanMoves();
          if (moves) {
            await saveToDB(db, moves, STORE_NAME_KOREAN_MOVES, META_STORE);
            setKoreanMovesArrayStates(moves);
          }
        } else {
          // 4. 24시간 안 지났으면 DB에서 가져오기
          const moves = await getFromDB(db, STORE_NAME_KOREAN_MOVES);
          setKoreanMovesArrayStates(moves);
        }
      }
    })();
  }, [initialMoves, refetchKoreanMoves, setKoreanMovesArrayStates]);

  useEffect(() => {
    setLoadingStates({
      isInitialMovesLoading,
      isKoreanMovesLoading,
    });
  }, [isInitialMovesLoading, isKoreanMovesLoading, setLoadingStates]);
};
