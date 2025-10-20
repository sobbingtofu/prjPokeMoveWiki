import PokemonCard from "@/components/PokmemonCard/PokemonCard";
import {useZustandStore} from "@/store/zustandStore";
import React from "react";

interface LearningPokemonsSectionProps {
  className?: string;
}

function LearningPokemonsSection({className = ""}: LearningPokemonsSectionProps) {
  const {lastSearchMovesArrayStates, detailedLearningPokemons_PreFilter} = useZustandStore();
  return (
    <section className={`${className} px-10 py-15 flex flex-col items-start gap-4`}>
      <h3 className="text-white font-bold text-2xl">아래 기술을 배우는 포켓몬</h3>
      {lastSearchMovesArrayStates.length === 0 && (
        <p className="text-gray-500 font-bold text-sm">검색된 포켓몬이 없습니다</p>
      )}
      <div className="flex flex-row gap-4 w-full flex-wrap">
        {lastSearchMovesArrayStates.map((move) => (
          <div
            key={move.id}
            className={`text-sm font-bold px-3 py-2 bg-${move.type.toLowerCase()}-shallow rounded-2xl flex justify-center items-center`}
          >
            {move.koreanName}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-4 w-full gap-x-3 gap-y-2">
        {detailedLearningPokemons_PreFilter.map((pokemon) => (
          <PokemonCard key={pokemon.name} pokemon={pokemon} />
        ))}
      </div>
    </section>
  );
}

export default LearningPokemonsSection;
