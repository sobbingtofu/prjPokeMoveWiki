"use client";
import {InitialLoadingScreen} from "@/components/InitialLoadingScreen/InitialLoadingScreen";
import {useLoadData_KoreanMovesArr} from "@/hooks/useLoadData_KoreanMovesArr";
import {SearchSection} from "@/sections/SearchMoveSection/SearchMoveSection";
import React, {useEffect} from "react";
import {SelectedMovesSection} from "../search-learning-pokemon/_sections/SelectedMovesSection/SelectedMovesSection";
import {useZustandStore} from "@/store/zustandStore";

function SearchMovesPage() {
  useLoadData_KoreanMovesArr();

  const {selectedMovesArrayStates} = useZustandStore();

  useEffect(() => {
    if (selectedMovesArrayStates.length > 0) {
      console.log("Selected Moves:", selectedMovesArrayStates);
    }
  }, [selectedMovesArrayStates]);

  return (
    <div className="w-dvw">
      <InitialLoadingScreen />
      <SearchSection dropDownHeight={160} smDropDownHeight={120} className="h-[30dvh]" type="searchMoves" />
    </div>
  );
}

export default SearchMovesPage;
