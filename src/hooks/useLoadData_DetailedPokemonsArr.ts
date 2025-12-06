"use client";

import {useQuery} from "@tanstack/react-query";
import {useZustandStore} from "@/store/zustandStore";
import {useEffect} from "react";
import {getInitialPokemons} from "@/logic/pokeapiLogics/fetchMovePokemonLogics";

import {fetchAndStoreDetailedPokemons} from "@/logic/pokeapiLogics/fetchAndStoreLogic_Pokemons";
import {detailedPokemInfoType} from "@/store/type";

export const useLoadData_DetailedPokemonsArr = () => {
  const setLoadingStates = useZustandStore((state) => state.setLoadingStates);
  const setDetailedPokemons = useZustandStore((state) => state.setDetailedPokemons);

  // 1단계: initialPokemons 가져오기 (TanStack Query only)
  const {data: initialPokemons, isLoading: isInitialPokemonsLoading} = useQuery({
    queryKey: ["initialPokemons"],
    queryFn: getInitialPokemons,
    staleTime: Infinity,
    gcTime: Infinity,
  });

  // 2단계: detailedPokemons 가져오기 (TanStack Query + IndexedDB)
  const {data: detailedPokemons, isLoading: isDetailedPokemonsLoading} = useQuery({
    queryKey: ["detailedPokemons", initialPokemons?.length],
    queryFn: async () => {
      try {
        if (!initialPokemons) return [];

        console.log("포켓몬 데이터 가져오기 시작");

        // 각 성공 배치마다 Zustand 상태 업데이트
        const handleProgressUpdate = (currentPokemons: detailedPokemInfoType[]) => {
          console.log(`Zustand 상태 업데이트: ${currentPokemons.length}개 포켓몬`);
          setDetailedPokemons(currentPokemons);
        };

        const detailedPokemonsData = await fetchAndStoreDetailedPokemons(initialPokemons, handleProgressUpdate);
        return detailedPokemonsData;
      } catch (error) {
        console.error("detailedPokemons 조회 중 오류:", error);
        throw error;
      }
    },
    enabled: !!initialPokemons && initialPokemons.length > 0,
    staleTime: Infinity,
    gcTime: Infinity,
    retry: 0,
  });

  // 3단계: 최종 확인  및 Zustand 최종 상태 업데이트
  useEffect(() => {
    if (detailedPokemons && detailedPokemons.length > 0) {
      console.log("최종 Zustand 상태 확인:", detailedPokemons);
      setDetailedPokemons(detailedPokemons);
    }
  }, [detailedPokemons, setDetailedPokemons]);

  useEffect(() => {
    setLoadingStates({
      isInitialPokemonsLoading,
      isDetailedPokemonsLoading,
    });
  }, [isInitialPokemonsLoading, isDetailedPokemonsLoading, setLoadingStates]);
};
