import PokemonCard from "@/components/PokemonCard/PokemonCard";
import ScrollContainer from "@/components/ScrollContainer/ScrollContainer";
import {useZustandStore} from "@/store/zustandStore";
import React from "react";

interface LearningPokemonsSectionProps {
  className?: string;
}

function LearningPokemonsSection({className = ""}: LearningPokemonsSectionProps) {
  const {lastSearchMovesArrayStates, detailedLearningPokemons_PreFilter} = useZustandStore();
  return (
    <section className={`${className} h-full  px-10 pt-15 flex flex-col items-start gap-4`}>
      <h3 className="text-white font-bold text-2xl">
        아래 기술을 배우는 포켓몬 ({detailedLearningPokemons_PreFilter.length})
      </h3>
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
      {detailedLearningPokemons_PreFilter.length > 0 && (
        <div
          className="grid grid-cols-4 w-full gap-x-3 gap-y-2 h-[75dvh]
          pr-2 overflow-y-scroll scrollbar-thin scrollbar-track-gray-700 scrollbar-thumb-gray-500
          no-scrollbar-buttons
          "
        >
          {detailedLearningPokemons_PreFilter.map((pokemon) => (
            <PokemonCard key={pokemon.name} pokemon={pokemon} />
          ))}
        </div>
      )}
    </section>
  );
}

export default LearningPokemonsSection;
