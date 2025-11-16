"use client";

import {useQuery} from "@tanstack/react-query";
import {useZustandStore} from "@/store/zustandStore";
import {useEffect, useRef} from "react";
import {generateDetailedPokemon, getInitialPokemons} from "@/logic/pokeapiLogics/fetchMovePokemonLogics";
import {getDBMeta, getFromDB, openDB, saveToDB} from "@/logic/indexedDBLogics/indexedDBLogics";
import {
  DB_NAME_DETAILED_POKEMONS,
  DB_VERSION,
  EXPIRE_MS,
  META_STORE,
  STORE_NAME_DETAILED_POKEMONS,
} from "@/store/constantStore";

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

        console.log("API에서 데이터 가져오기");

        const db = await openDB(
          DB_NAME_DETAILED_POKEMONS,
          DB_VERSION,
          STORE_NAME_DETAILED_POKEMONS,
          META_STORE,
          "pokemonId"
        );

        const meta = await getDBMeta(db, META_STORE);
        const now = Date.now();

        if (meta && now - meta.addedAt <= EXPIRE_MS) {
          // console.log("IndexedDB에서 데이터 가져오기");
          return await getFromDB(db, STORE_NAME_DETAILED_POKEMONS);
        }

        // console.log("generateDetailedPokemon 호출 시작");
        const pokemons = await generateDetailedPokemon(initialPokemons);
        // console.log("generateDetailedPokemon 완료, 포켓몬 개수:", pokemons?.length);

        if (!pokemons || pokemons.length === 0) {
          console.error("포켓몬 데이터를 가져오지 못했습니다");
          return [];
        }

        // console.log("DB에 저장 시작");
        await saveToDB(db, pokemons, STORE_NAME_DETAILED_POKEMONS, META_STORE);
        // console.log("DB 저장 완료");

        return pokemons;
      } catch (error) {
        console.error("detailedPokemons 조회 중 오류:", error);
        throw error; // TanStack Query가 에러를 처리하도록
      }
    },
    enabled: !!initialPokemons && initialPokemons.length > 0,
    staleTime: Infinity,
    gcTime: Infinity,
    retry: 0, // 재시도 비활성화 (디버깅용)
  });

  // 3단계: Zustand 상태 업데이트
  useEffect(() => {
    if (detailedPokemons && detailedPokemons.length > 0) {
      // console.log("Zustand 상태에 detailedPokemons 설정");
      // console.log(detailedPokemons);
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
