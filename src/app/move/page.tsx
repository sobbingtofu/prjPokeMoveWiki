"use client";

import {Loader} from "@/components/Loader/Loader";
import {SearchBar} from "@/components/SearchBar/SearchBar";
import {usePokemonMoveData} from "@/hooks/useMoveDataLoader";

import {useZustandStore} from "@/store/zustandStore";

export default function Home() {
  const {loadingStates, koreanMoveStates, setKoreanMoveStates, setLoadingStates} = useZustandStore();
  usePokemonMoveData();

  return (
    <div>
      <Loader />
      <SearchBar />
      <p>총 기술 수: {koreanMoveStates.length}</p>
    </div>
  );
}
