"use client";

import {useZustandStore} from "@/store/zustandStore";
import {useEffect} from "react";
import {useQuery} from "@tanstack/react-query";
import {generateValidKoreanMoves} from "@/logic/pokeapiLogics/generateValidKoreanMovesLogic";

export const useLoadData_KoreanMovesArr_v2 = () => {
  const setKoreanMovesArrayStates = useZustandStore((state) => state.setKoreanMovesArrayStates);
  const setLoadingStates = useZustandStore((state) => state.setLoadingStates);
  const loadKoreanMovesError = useZustandStore((state) => state.loadKoreanMovesError);
  const setLoadKoreanMovesError = useZustandStore((state) => state.setLoadKoreanMovesError);

  // 통합된 데이터 로드 함수
  const loadFinalKoreanMoves = async () => {
    try {
      const data = await generateValidKoreanMoves();
      setLoadKoreanMovesError(false);
      return data;
    } catch (e) {
      console.error("Error occured while loading moves:", e);
      setLoadKoreanMovesError(true);
      return [];
    }
  };

  const {data: koreanMoves, isLoading: isKoreanMovesLoading} = useQuery({
    queryKey: ["koreanMoves"],
    queryFn: loadFinalKoreanMoves,
    staleTime: loadKoreanMovesError ? 0 : Infinity,
    gcTime: Infinity,
  });

  // Zustand 상태 업데이트
  useEffect(() => {
    if (koreanMoves && koreanMoves.length > 0) {
      console.log("Supabase에서 가져온 기술 데이터: ", koreanMoves);
      setKoreanMovesArrayStates(koreanMoves);
      return;
    }
  }, [koreanMoves, setKoreanMovesArrayStates]);

  useEffect(() => {
    setLoadingStates({
      isKoreanMovesLoading,
    });
  }, [isKoreanMovesLoading, setLoadingStates]);
};
