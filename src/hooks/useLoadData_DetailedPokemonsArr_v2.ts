"use client";

import {useZustandStore} from "@/store/zustandStore";
import {useEffect} from "react";
import {useQuery} from "@tanstack/react-query";
import {generateValidDetailedPokemons} from "@/logic/pokeapiLogics/generateValidDetailedPokemonsLogic";

export const useLoadData_DetailedPokemonsArr_v2 = () => {
  const setDetailedPokemons = useZustandStore((state) => state.setDetailedPokemons);
  const setLoadingStates = useZustandStore((state) => state.setLoadingStates);
  const loadDetailedPokemonsError = useZustandStore((state) => state.loadDetailedPokemonsError);
  const setLoadDetailedPokemonsError = useZustandStore((state) => state.setLoadDetailedPokemonsError);

  // 통합된 데이터 로드 함수
  const loadFinalDetailedPokemons = async () => {
    try {
      const data = await generateValidDetailedPokemons();
      setLoadDetailedPokemonsError(false);
      return data;
    } catch (e) {
      console.error("Error occured while loading moves:", e);
      setLoadDetailedPokemonsError(true);
      return [];
    }
  };

  const {data: detailedPokemons, isLoading: isDetailedPokemonsLoading} = useQuery({
    queryKey: ["detailedPokemons"],
    queryFn: loadFinalDetailedPokemons,
    staleTime: loadDetailedPokemonsError ? 0 : Infinity,
    gcTime: Infinity,
  });

  // Zustand 상태 업데이트
  useEffect(() => {
    if (detailedPokemons && detailedPokemons.length > 0) {
      console.log("Supabase에서 가져온 기술 데이터: ", detailedPokemons);
      setDetailedPokemons(detailedPokemons);
      return;
    }
  }, [detailedPokemons, setDetailedPokemons]);
  useEffect(() => {
    setLoadingStates({
      isDetailedPokemonsLoading,
    });
  }, [isDetailedPokemonsLoading, setLoadingStates]);
};
