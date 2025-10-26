import {useQuery} from "@tanstack/react-query";
import {getInitialMoveData, generateKoreanMoveData} from "@/logic/pokeapiLogics/fetchMovePokemonLogics";
import {useZustandStore} from "@/store/zustandStore";
import {useEffect} from "react";

export const useLoadData_KoreanMovesArr = () => {
  const {setLoadingStates, setKoreanMovesArrayStates} = useZustandStore();

  // 초기 기술 데이터 쿼리
  const {data: initialMoves, isLoading: isInitialMovesLoading} = useQuery({
    queryKey: ["initialMoves"],
    queryFn: getInitialMoveData,
    staleTime: Infinity,
    gcTime: Infinity,
  });

  // 한국어 기술 데이터 쿼리 (initialMoves에 의존)
  const {data: koreanMoves, isLoading: isKoreanMovesLoading} = useQuery({
    queryKey: ["koreanMoves", initialMoves?.length], // initialMoves가 준비되면 실행
    queryFn: () => generateKoreanMoveData(initialMoves!),
    enabled: !!initialMoves, // initialMoves가 있을 때만 실행
    staleTime: Infinity,
    gcTime: Infinity,
  });

  // Zustand 스토어에 데이터 동기화
  useEffect(() => {
    if (koreanMoves) {
      setKoreanMovesArrayStates(koreanMoves);
    }
  }, [koreanMoves, setKoreanMovesArrayStates]);

  // 로딩 상태 업데이트
  useEffect(() => {
    setLoadingStates({
      isInitialMovesLoading,
      isKoreanMovesLoading,
    });
  }, [isInitialMovesLoading, isKoreanMovesLoading, setLoadingStates]);
};
