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
        className="flex md:flex-row w-screen min-h-[calc(100vh-50px)] relative min-w-[200px]
        overflow-y-auto scrollbar-thin scrollbar-track-gray-700 scrollbar-thumb-gray-500"
      >
        <div className="sm:w-[40%] w-full min-h-[calc(100vh-50px)]">
          <SearchSection dropDownHeight={160} smDropDownHeight={120} className="h-[160px] bg-gray-300" />
          <SelectedMovesSection className="min-h-[400px] h-[calc(100vh-210px)]" />
        </div>

        <LearningPokemonsSection />

        <LearningPokemonsBottomSheet />
      </div>
    </>
  );
}
