"use client";

import {InitialLoadingScreen} from "@/components/InitialLoadingScreen/InitialLoadingScreen";
import {SearchBar} from "@/components/SearchBar/SearchBar";
import {usePokemonMoveData} from "@/hooks/useMoveDataLoader";

import {useZustandStore} from "@/store/zustandStore";

export default function Home() {
  usePokemonMoveData();

  return (
    <div>
      <InitialLoadingScreen />
      <SearchBar />
    </div>
  );
}
