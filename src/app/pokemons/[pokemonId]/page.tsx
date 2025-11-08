"use client";

import {useZustandStore} from "@/store/zustandStore";
import React from "react";

import {InitialLoadingScreen} from "@/components/InitialLoadingScreen/InitialLoadingScreen";
import {useLoadData_DetailedPokemonsArr} from "@/hooks/useLoadData_DetailedPokemonsArr";

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
      <p>현재 포켓몬 리스트: {detailedPokemons.length}</p>
      <p>포켓몬 ID: {pokemonId}</p>
      <p>현재 포켓몬: {currentPokemon02?.koreanName}</p>
    </>
  );
}

export default page;
