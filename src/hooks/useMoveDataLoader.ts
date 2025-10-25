import {useMutation, useQuery} from "@tanstack/react-query";
import {getInitialMoveData, generateKoreanMoveData} from "@/logic/pokeapiLogics/pokeapiLogics";
import {useZustandStore} from "@/store/zustandStore";
import {useEffect} from "react";

export const usePokemonMoveData = () => {
  const {setLoadingStates, setKoreanMovesArrayStates} = useZustandStore();

  // 초기 기술 데이터 쿼리
  const {data: initialMoves, isLoading: isInitialMovesLoading} = useQuery({
    queryKey: ["initialMoves"],
    queryFn: getInitialMoveData,
    staleTime: Infinity,
    gcTime: Infinity, // 가비지 컬렉션 비활성화
  });

  // 한국어 기술 데이터 뮤테이션
  const {mutate: generateKoreanMoves, isPending: isKoreanMovesLoading} = useMutation({
    mutationFn: generateKoreanMoveData,
    onSuccess: (data) => {
      setKoreanMovesArrayStates(data);
      setLoadingStates({isInitialMovesLoading: false, isKoreanMovesLoading: false});
    },
    onError: (error) => {
      console.error("한국어 기술 데이터 생성 실패:", error);
      setKoreanMovesArrayStates([]);
      setLoadingStates({isInitialMovesLoading: false, isKoreanMovesLoading: false});
    },
  });

  // 초기 데이터 로드 후 한국어 데이터 생성
  useEffect(() => {
    if (initialMoves) {
      setLoadingStates({isInitialMovesLoading: false, isKoreanMovesLoading: true});
      generateKoreanMoves(initialMoves);
    }
  }, [initialMoves, generateKoreanMoves, setLoadingStates]);

  // 로딩 상태 업데이트
  useEffect(() => {
    setLoadingStates({
      isInitialMovesLoading,
      isKoreanMovesLoading,
    });
  }, [isInitialMovesLoading, isKoreanMovesLoading, setLoadingStates]);
};
