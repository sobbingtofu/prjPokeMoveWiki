"use client";

import {InitialLoadingScreen} from "@/components/InitialLoadingScreen/InitialLoadingScreen";
import {SearchSection} from "@/sections/SearchSection/SearchSection";
import {usePokemonMoveData} from "@/hooks/useMoveDataLoader";
import {SelectedMovesSection} from "@/sections/SelectedMovesSection/SelectedMovesSection";
import LearningPokemonsSection from "@/sections/LearningPokemonsSection/LearningPokemonsSection";

export default function SearchLearningPokemonPage() {
  usePokemonMoveData();

  return (
    <>
      <InitialLoadingScreen />
      <div className="flex md:flex-row w-dvw h-dvh">
        <div className="md:w-[40dvw] md:min-w-[400px] ">
          <SearchSection dropDownHeight={160} smDropDownHeight={120} className="h-[30dvh]" />
          <SelectedMovesSection className="h-[70dvh]" />
        </div>
        <div className="md:w-[60dvw] md:block hidden bg-gray-700 h-dvh">
          <LearningPokemonsSection />
        </div>
      </div>
    </>
  );
}
