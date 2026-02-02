"use client";
import {InitialLoadingScreen} from "@/components/InitialLoadingScreen/InitialLoadingScreen";
import {useLoadData_KoreanMovesArr_v2} from "@/hooks/useLoadData_KoreanMovesArr_v2";
import {SearchSection} from "@/sections/SearchMoveSection/SearchMoveSection";
import React from "react";

function SearchMovesPage() {
  useLoadData_KoreanMovesArr_v2();

  return (
    <div
      className="w-dvw min-h-dvh bg-gray-300 
      h-[calc(100dvh-7dvh)] overflow-y-auto scrollbar-thin scrollbar-track-gray-300 scrollbar-thumb-gray-500 no-scrollbar-buttons pb-20"
    >
      <InitialLoadingScreen />
      <SearchSection dropDownHeight={240} smDropDownHeight={120} className="" type="searchMoves" />
    </div>
  );
}

export default SearchMovesPage;
