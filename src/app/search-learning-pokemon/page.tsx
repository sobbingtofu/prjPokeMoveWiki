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
      <div className="flex md:flex-row w-dvw h-dvh relative">
        <div className="sm:w-[40%] w-full sm:min-w-[200px]">
          <SearchSection dropDownHeight={160} smDropDownHeight={120} className="h-[30dvh] bg-gray-300" />
          <SelectedMovesSection className="h-[70dvh]" />
        </div>

        <LearningPokemonsSection />

        <LearningPokemonsBottomSheet />
      </div>
    </>
  );
}
