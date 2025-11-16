"use client";

import {useQuery} from "@tanstack/react-query";
import {getInitialMoveData, generateKoreanMoveData} from "@/logic/pokeapiLogics/fetchMovePokemonLogics";
import {useZustandStore} from "@/store/zustandStore";
import {useEffect} from "react";
import {getDBMeta, getFromDB, openDB, saveToDB} from "@/logic/indexedDBLogics/indexedDBLogics";
import {DB_NAME_KOREAN_MOVES, DB_VERSION, EXPIRE_MS, META_STORE, STORE_NAME_KOREAN_MOVES} from "@/store/constantStore";

export const useLoadData_KoreanMovesArr = () => {
  const setLoadingStates = useZustandStore((state) => state.setLoadingStates);
  const setKoreanMovesArrayStates = useZustandStore((state) => state.setKoreanMovesArrayStates);

  // 1단계: initialMoves 가져오기 (TanStack Query only)
  const {data: initialMoves, isLoading: isInitialMovesLoading} = useQuery({
    queryKey: ["initialMoves"],
    queryFn: getInitialMoveData,
    staleTime: Infinity,
    gcTime: Infinity,
  });

  // 2단계: koreanMoves 가져오기 (TanStack Query + IndexedDB)
  const {data: koreanMoves, isLoading: isKoreanMovesLoading} = useQuery({
    queryKey: ["koreanMoves", initialMoves?.length],
    queryFn: async () => {
      try {
        if (!initialMoves) return [];

        console.log("기술 데이터 가져오기 시작");

        const db = await openDB(DB_NAME_KOREAN_MOVES, DB_VERSION, STORE_NAME_KOREAN_MOVES, META_STORE, "id");

        const meta = await getDBMeta(db, META_STORE);
        const now = Date.now();

        if (meta && now - meta.addedAt <= EXPIRE_MS) {
          console.log("IndexedDB에서 기술 데이터 가져오기");
          return await getFromDB(db, STORE_NAME_KOREAN_MOVES);
        }

        console.log("API에서 기술 데이터 가져오기");
        const moves = await generateKoreanMoveData(initialMoves);

        if (!moves || moves.length === 0) {
          console.error("기술 데이터를 가져오지 못했습니다");
          return [];
        }

        console.log("DB에 기술 데이터 저장");
        await saveToDB(db, moves, STORE_NAME_KOREAN_MOVES, META_STORE);

        return moves;
      } catch (error) {
        console.error("koreanMoves 조회 중 오류:", error);
        throw error; // TanStack Query가 에러를 처리하도록
      }
    },
    enabled: !!initialMoves && initialMoves.length > 0,
    staleTime: Infinity,
    gcTime: Infinity,
    retry: 0, // 재시도 비활성화 (디버깅용)
  });

  // 3단계: Zustand 상태 업데이트
  useEffect(() => {
    if (koreanMoves && koreanMoves.length > 0) {
      console.log("Zustand 상태에 koreanMoves 설정");
      setKoreanMovesArrayStates(koreanMoves);
    }
  }, [koreanMoves, setKoreanMovesArrayStates]);

  useEffect(() => {
    setLoadingStates({
      isInitialMovesLoading,
      isKoreanMovesLoading,
    });
  }, [isInitialMovesLoading, isKoreanMovesLoading, setLoadingStates]);
};
