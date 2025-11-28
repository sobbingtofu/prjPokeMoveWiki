"use client";
import {InitialLoadingScreen} from "@/components/InitialLoadingScreen/InitialLoadingScreen";
import {useLoadData_KoreanMovesArr} from "@/hooks/useLoadData_KoreanMovesArr";
import {SearchSection} from "@/sections/SearchMoveSection/SearchMoveSection";
import React, {useEffect} from "react";
import {SelectedMovesSection} from "../search-learning-pokemon/_sections/SelectedMovesSection/SelectedMovesSection";
import {useZustandStore} from "@/store/zustandStore";
import DetailedMoveSection from "@/sections/DetailedMoveSection/DetailedMoveSection";

function SearchMovesPage() {
  useLoadData_KoreanMovesArr();

  const {searchTargetMoveState} = useZustandStore();

  useEffect(() => {
    if (searchTargetMoveState !== null) {
      console.log("Selected Move:", searchTargetMoveState);
    }
  }, [searchTargetMoveState]);

  return (
    <div
      className="w-dvw min-h-dvh bg-gray-300 
      h-[calc(100dvh-7dvh)] overflow-y-auto scrollbar-thin scrollbar-track-gray-300 scrollbar-thumb-gray-500 no-scrollbar-buttons pb-20"
    >
      <InitialLoadingScreen />
      <SearchSection dropDownHeight={240} smDropDownHeight={120} className="" type="searchMoves" />
      {searchTargetMoveState !== null && <DetailedMoveSection />}
    </div>
  );
}

export default SearchMovesPage;
