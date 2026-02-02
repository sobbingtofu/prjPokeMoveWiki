"use client";
import KOREAN_POKEMONS_DATA from "@/store/KOREAN_POKEMONS.json";
import {detailedPokemInfoType} from "@/store/type";
import {useZustandStore} from "@/store/zustandStore";
import {useEffect} from "react";

export const useLoadData_DetailedPokemonsArr_v2 = () => {
  const setDetailedPokemons = useZustandStore((state) => state.setDetailedPokemons);

  // 3단계: 최종 확인  및 Zustand 최종 상태 업데이트
  useEffect(() => {
    console.log("useLoadData_DetailedPokemonsArr_v2: ", KOREAN_POKEMONS_DATA);
    setDetailedPokemons(KOREAN_POKEMONS_DATA as detailedPokemInfoType[]);
  }, [setDetailedPokemons]);
};
