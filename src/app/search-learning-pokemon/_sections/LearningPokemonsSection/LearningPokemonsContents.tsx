import {useZustandStore} from "@/store/zustandStore";
import {FilterSortDropdown} from "../../_components/FilterSortDropdown/FilterSortDropdown";
import {sortOptionType} from "@/store/type";
import {GEN_OPTIONS, LEARN_METHOD_OPTIONS, SORT_ASC_DESC_OPTIONS, SORT_OPTIONS} from "@/store/constantStore";
import useApplyFiltersChange from "@/hooks/useApplyFiltersChange";
import useApplySortingsChange from "@/hooks/useApplySortingsChange";
import PokemonCard from "../../_components/PokemonCard/PokemonCard";
import React from "react";

const LearningPokemonsContents = React.memo(function LearningPokemonsContents() {
  const lastSearchMovesArrayStates = useZustandStore((state) => state.lastSearchMovesArrayStates);
  const detailedLearningPokemons_Filtered = useZustandStore((state) => state.detailedLearningPokemons_Filtered);
  const genFilter = useZustandStore((state) => state.genFilter);
  const setGenFilter = useZustandStore((state) => state.setGenFilter);
  const learnMethodFilter = useZustandStore((state) => state.learnMethodFilter);
  const setLearnMethodFilter = useZustandStore((state) => state.setLearnMethodFilter);
  const sortOption = useZustandStore((state) => state.sortOption);
  const setSortOption = useZustandStore((state) => state.setSortOption);
  const sortAscDescOption = useZustandStore((state) => state.sortAscDescOption);
  const setSortAscDescOption = useZustandStore((state) => state.setSortAscDescOption);

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
    const newSortOption: sortOptionType = {
      alphabetical: false,
      hp: false,
      attack: false,
      defense: false,
      speed: false,
      specialAttack: false,
      specialDefense: false,
      hp_defense: false,
      hp_specialDefense: false,
      hp_defense_specialDefense: false,
      attack_speed: false,
      specialAttack_speed: false,
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
    <>
      {/* 필터 및 정렬 */}
      <div className="w-full flex flex-col gap-4 md:h-[15dvh] h-min">
        <div className="flex flex-col xl:flex-row justify-between xl:items-end items-start w-full md:gap-0 gap-3">
          <h3 className="text-white font-bold text-2xl">배우는 포켓몬 ({detailedLearningPokemons_Filtered.length})</h3>
          <div className="flex md:flex-row flex-col md:gap-6 gap-3 text-white font-bold text-xs">
            <div className="flex md:flex-col flex-row md:gap-1 gap-x-6 items-center md:items-start">
              <p className="text-xs text-gray-300">정렬</p>
              <div className="flex flex-row gap-2">
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
                  width={120}
                />
              </div>
            </div>
            <div className="flex md:flex-col flex-row md:gap-1 gap-x-6 items-center md:items-start">
              <p className="text-xs text-gray-300">필터</p>
              <div className="flex flex-row gap-2">
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
          </div>
        </div>
        {(lastSearchMovesArrayStates.length === 0 || detailedLearningPokemons_Filtered.length === 0) && (
          <p className="text-gray-500 font-bold text-sm">검색된 포켓몬이 없습니다</p>
        )}
        <div className="w-full flex justify-between items-center ">
          <div className="flex flex-row gap-4 w-[60%] flex-wrap ">
            {lastSearchMovesArrayStates.map((move) => (
              <div
                key={move.id}
                className={`text-sm font-bold px-3 py-2 bg-${move.type.toLowerCase()}-shallow rounded-2xl flex justify-center items-center`}
              >
                {move.koreanName}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 카드 나열 */}
      {detailedLearningPokemons_Filtered.length > 0 && (
        <div
          className="grid lg:grid-cols-4 grid-cols-2 w-full gap-x-3 gap-y-2
          md:h-[70dvh] sm:h-[66dvh] h-[58dvh]
          auto-rows-max pr-2 overflow-y-scroll scrollbar-thin scrollbar-track-gray-700 scrollbar-thumb-gray-500
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
    </>
  );
});

export default LearningPokemonsContents;
