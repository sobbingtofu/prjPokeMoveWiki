import React, {useState} from "react";
import LearningPokemonsContents from "./LearningPokemonsContents";
import {useZustandStore} from "@/store/zustandStore";

interface LearningPokemonsBottomSheetProps {
  className?: string;
}

function LearningPokemonsBottomSheet({className = ""}: LearningPokemonsBottomSheetProps) {
  const isLearningPokemonBottomSheetOpen = useZustandStore((state) => state.isLearningPokemonBottomSheetOpen);
  const setIsLearningPokemonBottomSheetOpen = useZustandStore((state) => state.setIsLearningPokemonBottomSheetOpen);

  const toggleSection = () => {
    setIsLearningPokemonBottomSheetOpen(!isLearningPokemonBottomSheetOpen);
  };

  return (
    <section
      className={`sm:w-[60%] sm:min-w-[30px] w-full bg-gray-700 absolute
         rounded-t-xl z-500
          h-dvh  overflow-hidden
          px-5 pt-0
          sm:hidden
          flex flex-col items-start gap-4
          transition-all duration-300 ease-in-out`}
      style={{
        top: isLearningPokemonBottomSheetOpen ? "80px" : "calc(100vh - 120px)", // isShown 값에 따라 위치 조정
      }}
    >
      {/* 드래그 핸들 */}
      <div className="w-full h-10 rounded-t-xl cursor-pointer flex justify-center items-start " onClick={toggleSection}>
        <div className="w-[65%] h-1.5 bg-gray-400 rounded-full  mt-3"></div>
      </div>

      <LearningPokemonsContents />
    </section>
  );
}

export default LearningPokemonsBottomSheet;
