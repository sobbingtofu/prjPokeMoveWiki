"use client";

import {InitialLoadingScreen} from "@/components/InitialLoadingScreen/InitialLoadingScreen";
import {SearchBar} from "@/components/SearchBar/SearchBar";
import {usePokemonMoveData} from "@/hooks/useMoveDataLoader";

import {useZustandStore} from "@/store/zustandStore";

export default function Home() {
  const {loadingStates, koreanMoveStates, setKoreanMoveStates, setLoadingStates} = useZustandStore();
  usePokemonMoveData();

  return (
    <div>
      <InitialLoadingScreen />
      <SearchBar />
    </div>
  );
}
