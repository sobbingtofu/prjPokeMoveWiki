"use client";

import {useZustandStore} from "@/store/zustandStore";
import React, {useEffect, useState} from "react";

import {InitialLoadingScreen} from "@/components/InitialLoadingScreen/InitialLoadingScreen";
import {useLoadData_DetailedPokemonsArr} from "@/hooks/useLoadData_DetailedPokemonsArr";
import {getFromDB, openDB} from "@/logic/indexedDBLogics/indexedDBLogics";
import {DB_NAME_DETAILED_POKEMONS, DB_VERSION, META_STORE, STORE_NAME_DETAILED_POKEMONS} from "@/store/constantStore";
import {detailedPokemInfoType} from "@/store/type";

interface pageProps {
  params: Promise<{pokemonId: string}>;
}

function page({params}: pageProps) {
  useLoadData_DetailedPokemonsArr();
  const {pokemonId} = React.use(params);

  const detailedPokemons = useZustandStore((state) => state.detailedPokemons);

  const currentPokemon02 = detailedPokemons.find((p) => p.pokemonId == pokemonId);

  return (
    <>
      <InitialLoadingScreen />
      <p>방식 2 {currentPokemon02?.koreanName}</p>
    </>
  );
}

export default page;
