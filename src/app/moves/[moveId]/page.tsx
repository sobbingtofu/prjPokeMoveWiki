"use client";
import {InitialLoadingScreen} from "@/components/InitialLoadingScreen/InitialLoadingScreen";
import {useLoadData_KoreanMovesArr} from "@/hooks/useLoadData_KoreanMovesArr";
import {SearchSection} from "@/sections/SearchMoveSection/SearchMoveSection";
import React, {useEffect} from "react";
import {useZustandStore} from "@/store/zustandStore";
import DetailedMoveSection from "@/sections/DetailedMoveSection/DetailedMoveSection";
import {selectedMoveType} from "@/store/type";
import LearningPokemonsSection from "@/app/search-learning-pokemon/_sections/LearningPokemonsSection/LearningPokemonsSection";

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
      {editedCurrentMove && (
        <>
          <DetailedMoveSection currentMove={editedCurrentMove} />
          <section className="w-full flex justify-center items-start ">
            <div className="w-[70%] min-w-[360px]">
              <LearningPokemonsSection type="movesDetail" currentMoveId={moveId} />
            </div>
          </section>
        </>
      )}
    </div>
  );
}

export default MovesDetailPage;
