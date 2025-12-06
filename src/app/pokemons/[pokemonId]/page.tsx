"use client";

import {useZustandStore} from "@/store/zustandStore";
import React from "react";

import {InitialLoadingScreen} from "@/components/InitialLoadingScreen/InitialLoadingScreen";
import {useLoadData_DetailedPokemonsArr} from "@/hooks/useLoadData_DetailedPokemonsArr";
import DetailedPokemonSection from "@/sections/DetailedPokemonSection/DetailedPokemonSection";

interface pageProps {
  params: Promise<{pokemonId: string}>;
}

function page({params}: pageProps) {
  useLoadData_DetailedPokemonsArr();
  const {pokemonId} = React.use(params);

  const detailedPokemons = useZustandStore((state) => state.detailedPokemons);

  const currentPokemon = detailedPokemons.find((p) => p.pokemonId == pokemonId);

  return (
    <div className="w-dvw min-h-dvh bg-gray-300">
      <InitialLoadingScreen />
      {currentPokemon && <DetailedPokemonSection currentPokemon={currentPokemon} />}
    </div>
  );
}

export default page;
