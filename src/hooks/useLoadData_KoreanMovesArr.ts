"use client";

import {useQuery} from "@tanstack/react-query";
import {getInitialMoveData} from "@/logic/pokeapiLogics/fetchMovePokemonLogics";
import {useZustandStore} from "@/store/zustandStore";
import {useEffect} from "react";
import {fetchAndStoreKoreanMoves} from "@/logic/pokeapiLogics/fetchAndStoreLogic_Moves";
import {koreanMoveType} from "@/logic/pokeapiLogics/type";

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

        // 각 성공 배치마다 Zustand 상태 업데이트
        const handleProgressUpdate = (currentMoves: koreanMoveType[]) => {
          const filteredMoves = currentMoves.filter(
            (move) => move.type !== "shadow" && !move.korDescription.includes("사용할 수 없는 기술")
          );
          console.log(`Zustand 상태 업데이트: ${filteredMoves.length}개 기술`);
          setKoreanMovesArrayStates(filteredMoves);
        };

        const koreanMovesData = await fetchAndStoreKoreanMoves(initialMoves, handleProgressUpdate);
        return koreanMovesData;
      } catch (error) {
        console.error("koreanMoves 조회 중 오류:", error);
        throw error;
      }
    },
    enabled: !!initialMoves && initialMoves.length > 0,
    staleTime: Infinity,
    gcTime: Infinity,
    retry: 0,
  });

  // 3단계: Zustand 상태 업데이트
  useEffect(() => {
    if (koreanMoves && koreanMoves.length > 0) {
      console.log("최종 Zustand 상태 확인:", koreanMoves);
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
