"use client";

import {InitialLoadingScreen} from "@/components/InitialLoadingScreen/InitialLoadingScreen";
import {SearchSection} from "@/sections/SearchSection/SearchSection";
import {usePokemonMoveData} from "@/hooks/useMoveDataLoader";
import {SelectedMovesSection} from "@/sections/SelectedMovesSection/SelectedMovesSection";

export default function Home() {
  usePokemonMoveData();

  return (
    <>
      <InitialLoadingScreen />
      <div className="flex flex-row">
        <SearchSection className="flex-1" />
        <SelectedMovesSection className="flex-1" />
      </div>
    </>
  );
}
