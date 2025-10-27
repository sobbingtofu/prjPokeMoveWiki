"use client";

import {useQuery} from "@tanstack/react-query";

import {useZustandStore} from "@/store/zustandStore";
import {useEffect} from "react";
import {generateDetailedPokemon, getInitialPokemons} from "@/logic/pokeapiLogics/fetchMovePokemonLogics";

export const useLoadData_PokemonsEV = () => {
  const setLoadingStates = useZustandStore((state) => state.setLoadingStates);
  const setDetailedPokemons = useZustandStore((state) => state.setDetailedPokemons);

  // 초기 푸키먼 데이터 쿼리
  const {data: initialPokemons, isLoading: isInitialPokemonsLoading} = useQuery({
    queryKey: ["initialPokemons"],
    queryFn: getInitialPokemons,
    staleTime: Infinity,
    gcTime: Infinity,
  });

  // 디테일 추가 데이터 쿼리 (initialPokemons에 의존)
  const {data: detailedPokemons, isLoading: isDetailedPokemonsLoading} = useQuery({
    queryKey: ["PokemonsEV", initialPokemons?.length], // initialMoves가 준비되면 실행
    queryFn: () => generateDetailedPokemon(initialPokemons!, "EV"),
    enabled: !!initialPokemons, // initialMoves가 있을 때만 실행
    staleTime: Infinity,
    gcTime: Infinity,
  });

  // Zustand 스토어에 데이터 동기화
  useEffect(() => {
    if (detailedPokemons) {
      setDetailedPokemons(detailedPokemons);
    }
  }, [detailedPokemons, setDetailedPokemons]);

  // 로딩 상태 업데이트
  useEffect(() => {
    setLoadingStates({
      isInitialPokemonsLoading,
      isDetailedPokemonsLoading,
    });
  }, [isInitialPokemonsLoading, isDetailedPokemonsLoading, setLoadingStates]);
};
