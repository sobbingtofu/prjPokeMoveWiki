"use client";
import {InitialLoadingScreen} from "@/components/InitialLoadingScreen/InitialLoadingScreen";
import {useLoadData_KoreanMovesArr} from "@/hooks/useLoadData_KoreanMovesArr";
import {SearchSection} from "@/sections/SearchMoveSection/SearchMoveSection";
import React, {useEffect} from "react";
import {useZustandStore} from "@/store/zustandStore";
import DetailedMoveSection from "@/sections/DetailedMoveSection/DetailedMoveSection";
import {selectedMoveType} from "@/store/type";

interface MovesDetailPageProps {
  params: Promise<{moveId: string}>;
}

function MovesDetailPage({params}: MovesDetailPageProps) {
  useLoadData_KoreanMovesArr();

  const {koreanMovesArrayStates} = useZustandStore();

  const {moveId} = React.use(params);

  const currentMove = koreanMovesArrayStates.find((p) => p.id == parseInt(moveId));

  useEffect(() => {
    console.log("Current Move Id:", moveId);
    if (currentMove !== null) {
      console.log("Selected Move:", currentMove);
    }
  }, [currentMove]);

  const editedCurrentMove: selectedMoveType | null = currentMove
    ? {...currentMove, isSelectedForDeletion: false}
    : null;

  return (
    <div
      className="w-dvw min-h-dvh bg-gray-300 
      h-[calc(100dvh-7dvh)] overflow-y-auto scrollbar-thin scrollbar-track-gray-300 scrollbar-thumb-gray-500 no-scrollbar-buttons pb-20"
    >
      <InitialLoadingScreen />
      <SearchSection dropDownHeight={240} smDropDownHeight={120} className="" type="movesDetail" />
      {!editedCurrentMove && "선택된 기술 없음"}
      {editedCurrentMove && <DetailedMoveSection currentMove={editedCurrentMove} />}
    </div>
  );
}

export default MovesDetailPage;
