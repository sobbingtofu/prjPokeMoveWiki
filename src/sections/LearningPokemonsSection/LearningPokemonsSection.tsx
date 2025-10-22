import {FilterSortDropdown} from "@/components/FilterSortDropdown/FilterSortDropdown";
import PokemonCard from "@/components/PokemonCard/PokemonCard";
import useApplyFiltersChange from "@/hooks/useApplyFiltersChange";
import useApplySortingsChange from "@/hooks/useApplySortingsChange";
import {GEN_OPTIONS, LEARN_METHOD_OPTIONS, SORT_ASC_DESC_OPTIONS, SORT_OPTIONS} from "@/store/constantStore";
import {useZustandStore} from "@/store/zustandStore";
import React from "react";

interface LearningPokemonsSectionProps {
  className?: string;
}

function LearningPokemonsSection({className = ""}: LearningPokemonsSectionProps) {
  const {lastSearchMovesArrayStates, detailedLearningPokemons_Filtered} = useZustandStore();
  const {genFilter, setGenFilter, learnMethodFilter, setLearnMethodFilter} = useZustandStore();
  const {sortOption, setSortOption, sortAscDescOption, setSortAscDescOption} = useZustandStore();

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

  const handleSortOptionToggle = (key: string) => {
    const newSortOption: {
      alphabetical: boolean;
      hp: boolean;
      attack: boolean;
      defense: boolean;
      speed: boolean;
      specialAttack: boolean;
      specialDefense: boolean;
    } = {
      alphabetical: false,
      hp: false,
      attack: false,
      defense: false,
      speed: false,
      specialAttack: false,
      specialDefense: false,
    };
    Object.keys(sortOption).forEach((k) => {
      newSortOption[k as keyof typeof newSortOption] = k === key;
    });
    setSortOption(newSortOption);
  };

  const handleSortAscDescOptionToggle = (key: string) => {
    const newSortAscDescOption: {asc: boolean; desc: boolean} = {asc: false, desc: false};
    Object.keys(sortAscDescOption).forEach((k) => {
      newSortAscDescOption[k as keyof typeof newSortAscDescOption] = k === key;
    });
    setSortAscDescOption(newSortAscDescOption);
  };

  const currentGenText =
    GEN_OPTIONS.find((option) => {
      return option.key === Object.entries(genFilter).find(([key, value]) => value)?.[0];
    })?.label || "모든";

  const currentSortOptionText =
    SORT_OPTIONS.find((option) => {
      return option.key === Object.entries(sortOption).find(([key, value]) => value)?.[0];
    })?.label || "정렬";

  const currentSortAscDescOption =
    SORT_ASC_DESC_OPTIONS.find((option) => {
      return option.key === Object.entries(sortAscDescOption).find(([key, value]) => value)?.[0];
    })?.label || "";

  useApplyFiltersChange();
  useApplySortingsChange();

  return (
    <section className={`${className} h-full  px-10 pt-15 flex flex-col items-start gap-4`}>
      <div className="flex justify-between items-end w-full">
        <h3 className="text-white font-bold text-2xl">배우는 포켓몬 ({detailedLearningPokemons_Filtered.length})</h3>
        <div className="flex flex-row gap-4 text-white font-bold text-xs">
          <FilterSortDropdown
            title={currentSortAscDescOption}
            options={SORT_ASC_DESC_OPTIONS}
            selectedOptions={sortAscDescOption}
            onToggle={handleSortAscDescOptionToggle}
          />
          <FilterSortDropdown
            title={currentSortOptionText}
            options={SORT_OPTIONS}
            selectedOptions={sortOption}
            onToggle={handleSortOptionToggle}
          />
          <FilterSortDropdown
            title={currentGenText}
            options={GEN_OPTIONS}
            selectedOptions={genFilter}
            onToggle={handleGenToggle}
          />
          <FilterSortDropdown
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
          {detailedLearningPokemons_Filtered.map((pokemon, index) => (
            <PokemonCard
              key={`${pokemon.name}-${index}`} // 포켓몬 이름과 인덱스 조합
              pokemon={pokemon}
            />
          ))}
        </div>
      )}
    </section>
  );
}

export default LearningPokemonsSection;
