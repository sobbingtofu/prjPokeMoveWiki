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

  // 쿼리 준비
  const {data: initialPokemons, isLoading: isInitialPokemonsLoading} = useQuery({
    queryKey: ["initialPokemons"],
    queryFn: getInitialPokemons,
    staleTime: Infinity,
    gcTime: Infinity,
  });

  const {
    data: detailedPokemons,
    isLoading: isDetailedPokemonsLoading,
    refetch: refetchDetailedPokemons,
  } = useQuery({
    queryKey: ["detailedPokemons", initialPokemons?.length],
    queryFn: () => generateDetailedPokemon(initialPokemons!),
    enabled: false, // 직접 실행
    staleTime: Infinity,
    gcTime: Infinity,
  });

  const didRunRef = useRef(false);

  useEffect(() => {
    if (!initialPokemons || didRunRef.current) return;
    didRunRef.current = true;

    (async () => {
      const db = await openDB(DB_NAME_DETAILED_POKEMONS, DB_VERSION, STORE_NAME_DETAILED_POKEMONS, META_STORE);
      const meta = await getDBMeta(db, META_STORE);

      if (!meta) {
        // 1. DB가 없으면 쿼리 실행 후 저장
        const {data: pokemons} = await refetchDetailedPokemons();
        if (pokemons) {
          await saveToDB(db, pokemons, STORE_NAME_DETAILED_POKEMONS, META_STORE);
          setDetailedPokemons(pokemons);
        }
      } else {
        // 3, 4. DB가 있으면 시간 확인
        const now = Date.now();
        if (now - meta.addedAt > EXPIRE_MS) {
          // 3. 24시간 지났으면 쿼리 실행 후 덮어쓰기
          const {data: pokemons} = await refetchDetailedPokemons();
          if (pokemons) {
            await saveToDB(db, pokemons, STORE_NAME_DETAILED_POKEMONS, META_STORE);
            setDetailedPokemons(pokemons);
          }
        } else {
          // 4. 24시간 안 지났으면 DB에서 가져오기
          const pokemons = await getFromDB(db, STORE_NAME_DETAILED_POKEMONS);
          setDetailedPokemons(pokemons);
        }
      }
    })();
  }, [initialPokemons, refetchDetailedPokemons, setDetailedPokemons]);

  useEffect(() => {
    setLoadingStates({
      isInitialPokemonsLoading,
      isDetailedPokemonsLoading,
    });
  }, [isInitialPokemonsLoading, isDetailedPokemonsLoading, setLoadingStates]);
};
