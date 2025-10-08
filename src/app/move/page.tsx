"use client";

import {InitialLoadingScreen} from "@/components/InitialLoadingScreen/InitialLoadingScreen";
import {SearchSection} from "@/components/SearchSection/SearchSection";
import {usePokemonMoveData} from "@/hooks/useMoveDataLoader";

export default function Home() {
  usePokemonMoveData();

  return (
    <>
      <InitialLoadingScreen />
      <div className="flex flex-row">
        <SearchSection className="flex-1" />
        <section className="flex-1"></section>
      </div>
    </>
  );
}
