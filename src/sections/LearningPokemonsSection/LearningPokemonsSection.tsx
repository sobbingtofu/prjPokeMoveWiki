import {useZustandStore} from "@/store/zustandStore";
import React from "react";

interface LearningPokemonsSectionProps {
  className?: string;
}

function LearningPokemonsSection({className = ""}: LearningPokemonsSectionProps) {
  const {lastSearchMovesArrayStates, detailedLearningPokemons} = useZustandStore();
  return (
    <section className={`${className} px-10 py-15 flex flex-col items-start gap-4`}>
      <h3 className="text-white font-bold text-2xl">아래 기술을 배우는 포켓몬</h3>
      <div className="flex flex-row gap-4 w-full flex-wrap">
        {lastSearchMovesArrayStates.map((move) => (
          <div
            key={move.id}
            className="text-sm font-bold px-3 py-2 bg-gray-400 rounded-2xl flex justify-center items-center"
          >
            {move.koreanName}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-3 w-full gap-x-3 gap-y-2">
        {detailedLearningPokemons.map((pokemon) => (
          <div
            key={pokemon.name}
            className="text-sm font-bold px-3 py-2 bg-gray-100 rounded-2xl flex flex-col justify-center items-start gap-2"
          >
            <p>{pokemon.koreanName}</p>
            <p>basicURL : {pokemon.basicUrl}</p>
            <p>speciesURL : {pokemon.speciesUrl}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default LearningPokemonsSection;
