"use client";

import {InitialLoadingScreen} from "@/components/InitialLoadingScreen/InitialLoadingScreen";
import {SearchSection} from "@/sections/SearchSection/SearchSection";
import {usePokemonMoveData} from "@/hooks/useMoveDataLoader";
import {SelectedMovesSection} from "@/sections/SelectedMovesSection/SelectedMovesSection";

export default function SearchPage() {
  usePokemonMoveData();

  return (
    <>
      <InitialLoadingScreen />

      <div className="md:w-[40dvw] md:min-w-[400px] w-dvw h-dvh">
        <SearchSection className="h-[30dvh]" />
        <SelectedMovesSection className="h-[70dvh]" />
      </div>
    </>
  );
}
