"use client";

import React, {useEffect} from "react";
import LearningPokemonsContents from "./LearningPokemonsContents";
import {useZustandStore} from "@/store/zustandStore";
import useGenerateSingleMoveLearningPokemons from "@/hooks/useGenerateSingleMoveLearningPokemons";
import {selectedMoveType} from "@/store/type";
import {Loader} from "@/components/Loader/Loader";

interface LearningPokemonsSectionProps {
  className?: string;
  type?: "searchLearningPokemons" | "movesDetail";
  currentMoveId?: string;
}

function LearningPokemonsSection({
  className = "",
  type = "searchLearningPokemons",
  currentMoveId,
}: LearningPokemonsSectionProps) {
  const {koreanMovesArrayStates} = useZustandStore();

  const currentMove = currentMoveId
    ? koreanMovesArrayStates.find((p) => p.id == parseInt(currentMoveId)) || null
    : null;

  const {generateSingleMoveLearningPokemons, isGenerating} = useGenerateSingleMoveLearningPokemons();

  const editedCurrentMove: selectedMoveType | null = currentMove
    ? {...currentMove, isSelectedForDeletion: false}
    : null;

  useEffect(() => {
    // 기술 상세 페이지에서 해당 섹션 호출된 경우, 해당 기술에 대해 배우는 포켓몬 정보 생성
    if (type === "movesDetail" && (editedCurrentMove !== null || !isGenerating)) {
      generateSingleMoveLearningPokemons(editedCurrentMove);
    }
  }, [currentMoveId, editedCurrentMove, generateSingleMoveLearningPokemons, isGenerating]);

  return (
    <section
      className={`${className} pt-[20px] pb-[20px] flex flex-col items-start flex-shrink-0 flex-1
      ${
        type === "searchLearningPokemons"
          ? " bg-gray-700 w-[60%]  sm:flex hidden px-10 min-h-[calc(100vh-64px)]"
          : "w-full mt-4 sm:rounded-lg rounded-none bg-gray-700 border border-gray-800 min-h-[400px] sm:pb-10 pb-20 h-full px-4 sm:px-10"
      }
    `}
    >
      {type === "movesDetail" && isGenerating && (
        <div className="w-full h-[300px] flex justify-center items-center">
          <Loader />
        </div>
      )}
      {type === "searchLearningPokemons" && <LearningPokemonsContents type={type} />}
      {type === "movesDetail" && !isGenerating && <LearningPokemonsContents type={type} />}
    </section>
  );
}

export default LearningPokemonsSection;
