"use client";
import {InitialLoadingScreen} from "@/components/InitialLoadingScreen/InitialLoadingScreen";
import {SearchSection} from "@/sections/SearchMoveSection/SearchMoveSection";
import React, {useEffect, useRef} from "react";
import {useZustandStore} from "@/store/zustandStore";
import DetailedMoveSection from "@/sections/DetailedMoveSection/DetailedMoveSection";
import {selectedMoveType} from "@/store/type";
import LearningPokemonsSection from "@/app/search-learning-pokemon/_sections/LearningPokemonsSection/LearningPokemonsSection";
import ScrollToTopButton from "@/components/ScrollToTopButton/ScrollToTopButton";
import LearningPokemonsBottomSheet from "@/app/search-learning-pokemon/_sections/LearningPokemonsSection/LearningPokemonsBottomSheet";
import {useLoadData_KoreanMovesArr_v2} from "@/hooks/useLoadData_KoreanMovesArr_v2";

interface MovesDetailPageProps {
  params: Promise<{moveId: string}>;
}

function MovesDetailPage({params}: MovesDetailPageProps) {
  useLoadData_KoreanMovesArr_v2();

  const {koreanMovesArrayStates} = useZustandStore();

  const {moveId} = React.use(params);

  const currentMove = koreanMovesArrayStates.find((p) => p.id == parseInt(moveId));

  const sectionRef = useRef<HTMLDivElement>(null!);

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
      h-dvh
      overflow-y-auto scrollbar-thin scrollbar-track-gray-300 scrollbar-thumb-gray-500 no-scrollbar-buttons
      sm:pb-20 pb-0
      "
      ref={sectionRef}
    >
      <InitialLoadingScreen />
      <SearchSection dropDownHeight={240} smDropDownHeight={120} className="" type="movesDetail" />
      {editedCurrentMove && (
        <>
          <DetailedMoveSection currentMove={editedCurrentMove} />
          <section className="w-full flex justify-center items-start ">
            <div className="sm:w-[70%] w-full min-w-[360px] sm:block flex justify-center">
              <LearningPokemonsSection type="movesDetail" currentMoveId={moveId} />
            </div>
          </section>
        </>
      )}
      <ScrollToTopButton scrollContainerRef={sectionRef} durationTime={300} />
    </div>
  );
}

export default MovesDetailPage;
