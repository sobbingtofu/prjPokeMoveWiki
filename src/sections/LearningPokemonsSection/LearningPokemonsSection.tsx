import {FilterDropdown} from "@/components/FilterDropdown/FilterDropdown";
import PokemonCard from "@/components/PokemonCard/PokemonCard";
import {GEN_OPTIONS, LEARN_METHOD_OPTIONS, METHOD_NAME_MAP} from "@/store/constantStore";
import {useZustandStore} from "@/store/zustandStore";
import React from "react";

interface LearningPokemonsSectionProps {
  className?: string;
}

function LearningPokemonsSection({className = ""}: LearningPokemonsSectionProps) {
  const {lastSearchMovesArrayStates, detailedLearningPokemons_Filtered} = useZustandStore();
  const {genFilter, setGenFilter, learnMethodFilter, setLearnMethodFilter} = useZustandStore();

  const handleGenToggle = (key: string) => {
    const newGenFilter: {[key: string]: boolean} = {};
    Object.keys(genFilter).forEach((k) => {
      newGenFilter[k] = k === key;
    });
    setGenFilter(newGenFilter);
  };

  const handleLearnMethodToggle = (key: string) => {
    setLearnMethodFilter({
      ...learnMethodFilter,
      [key]: !learnMethodFilter[key as keyof typeof learnMethodFilter],
    });
  };

  const currentGenText =
    GEN_OPTIONS.find((option) => {
      return option.key === Object.entries(genFilter).find(([key, value]) => value)?.[0];
    })?.label || "모든";

  return (
    <section className={`${className} h-full  px-10 pt-15 flex flex-col items-start gap-4`}>
      <div className="flex justify-between items-end w-full">
        <h3 className="text-white font-bold text-2xl">배우는 포켓몬 ({detailedLearningPokemons_Filtered.length})</h3>
        <div className="flex flex-row gap-4 text-white font-bold text-xs">
          <FilterDropdown
            title={currentGenText}
            options={GEN_OPTIONS}
            selectedOptions={genFilter}
            onToggle={handleGenToggle}
          />
          <FilterDropdown
            title="배우는 방법"
            options={LEARN_METHOD_OPTIONS}
            selectedOptions={learnMethodFilter}
            onToggle={handleLearnMethodToggle}
          />
        </div>
      </div>
      {(lastSearchMovesArrayStates.length === 0 || detailedLearningPokemons_Filtered.length === 0) && (
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
      {detailedLearningPokemons_Filtered.length > 0 && (
        <div
          className="grid grid-cols-4 w-full gap-x-3 gap-y-2 h-[75dvh] auto-rows-max
          pr-2 overflow-y-scroll scrollbar-thin scrollbar-track-gray-700 scrollbar-thumb-gray-500
          no-scrollbar-buttons
          "
        >
          {detailedLearningPokemons_Filtered.map((pokemon) => (
            <PokemonCard key={pokemon.name} pokemon={pokemon} />
          ))}
        </div>
      )}
    </section>
  );
}

export default LearningPokemonsSection;
