"use client";

import {InitialLoadingScreen} from "@/components/InitialLoadingScreen/InitialLoadingScreen";
import {useLoadData_KoreanMovesArr_v2} from "@/hooks/useLoadData_KoreanMovesArr_v2";
import {SearchSection} from "@/sections/SearchMoveSection/SearchMoveSection";
import {SelectedMovesSection} from "./_sections/SelectedMovesSection/SelectedMovesSection";
import LearningPokemonsSection from "./_sections/LearningPokemonsSection/LearningPokemonsSection";
import LearningPokemonsBottomSheet from "./_sections/LearningPokemonsSection/LearningPokemonsBottomSheet";

export default function SearchLearningPokemonPage() {
  useLoadData_KoreanMovesArr_v2();

  return (
    <>
      <InitialLoadingScreen />
      <div
        className="flex md:flex-row w-screen h-full relative min-w-[200px]
        overflow-y-hidden sm:overflow-y-auto scrollbar-thin scrollbar-track-gray-700 scrollbar-thumb-gray-500"
      >
        <div className="sm:w-[384px] w-full min-h-[512px]">
          <SearchSection dropDownHeight={160} smDropDownHeight={120} className="" />
          <SelectedMovesSection />
        </div>

        <LearningPokemonsSection />

        <LearningPokemonsBottomSheet />
      </div>
    </>
  );
}
