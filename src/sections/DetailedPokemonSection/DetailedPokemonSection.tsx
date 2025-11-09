import {useZustandStore} from "@/store/zustandStore";
import React from "react";

interface DetailedPokemonSectionProps {
  pokemonId: string;
}

function DetailedPokemonSection({pokemonId}: DetailedPokemonSectionProps) {
  const detailedPokemons = useZustandStore((state) => state.detailedPokemons);

  const currentPokemon02 = detailedPokemons.find((p) => p.pokemonId == pokemonId);
  return (
    <div>
      <p>현재 포켓몬 리스트: {detailedPokemons.length}</p>
      <p>포켓몬 ID: {pokemonId}</p>
      <p>현재 포켓몬: {currentPokemon02?.koreanName}</p>
    </div>
  );
}

export default DetailedPokemonSection;
