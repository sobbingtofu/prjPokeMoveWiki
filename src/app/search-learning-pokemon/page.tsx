"use client";

import {InitialLoadingScreen} from "@/components/InitialLoadingScreen/InitialLoadingScreen";
import {SearchSection} from "@/app/search-learning-pokemon/_sections/SearchSection/SearchSection";
import {useLoadData_KoreanMovesArr} from "@/hooks/useLoadData_KoreanMovesArr";
import {SelectedMovesSection} from "@/app/search-learning-pokemon/_sections/SelectedMovesSection/SelectedMovesSection";
import LearningPokemonsSection from "@/app/search-learning-pokemon/_sections/LearningPokemonsSection/LearningPokemonsSection";
import LearningPokemonsBottomSheet from "./_sections/LearningPokemonsSection/LearningPokemonsBottomSheet";

export default function SearchLearningPokemonPage() {
  useLoadData_KoreanMovesArr();

  return (
    <>
      <InitialLoadingScreen />
      <div className="flex md:flex-row w-dvw h-dvh relative">
        <div className="sm:w-[40%] w-full sm:min-w-[200px]">
          <SearchSection dropDownHeight={160} smDropDownHeight={120} className="h-[30dvh]" />
          <SelectedMovesSection className="h-[70dvh]" />
        </div>

        <LearningPokemonsSection />

        <LearningPokemonsBottomSheet />
      </div>
    </>
  );
}
