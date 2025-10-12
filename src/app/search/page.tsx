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
      <div className="flex sm:flex-row flex-col w-dvw h-dvh">
        <SearchSection className="sm:flex-1" />
        <SelectedMovesSection className="sm:flex-1" />
      </div>
    </>
  );
}
