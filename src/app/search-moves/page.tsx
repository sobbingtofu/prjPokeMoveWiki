"use client";
import {InitialLoadingScreen} from "@/components/InitialLoadingScreen/InitialLoadingScreen";
import {useLoadData_KoreanMovesArr} from "@/hooks/useLoadData_KoreanMovesArr";
import {SearchSection} from "@/sections/SearchMoveSection/SearchMoveSection";
import React, {useEffect} from "react";
import {SelectedMovesSection} from "../search-learning-pokemon/_sections/SelectedMovesSection/SelectedMovesSection";
import {useZustandStore} from "@/store/zustandStore";

function SearchMovesPage() {
  useLoadData_KoreanMovesArr();

  const {searchTargetMoveState} = useZustandStore();

  useEffect(() => {
    if (searchTargetMoveState !== null) {
      console.log("Selected Move:", searchTargetMoveState);
    }
  }, [searchTargetMoveState]);

  return (
    <div className="w-dvw min-h-dvh bg-gray-300">
      <InitialLoadingScreen />
      <SearchSection dropDownHeight={240} smDropDownHeight={120} className="bg-cyan-400" type="searchMoves" />
      <div>{searchTargetMoveState !== null ? searchTargetMoveState.koreanName : "선택된 기술 없음"}</div>
    </div>
  );
}

export default SearchMovesPage;
