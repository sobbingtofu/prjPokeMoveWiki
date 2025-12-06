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
    if (type === "movesDetail" && (editedCurrentMove !== null || !isGenerating)) {
      generateSingleMoveLearningPokemons(editedCurrentMove);
    }
  }, [currentMoveId]);

  return (
    <section
      className={`${className} pt-7  flex-col items-start gap-4 
      ${
        type === "searchLearningPokemons"
          ? "w-[60%] bg-gray-700 h-full sm:flex hidden px-10"
          : "w-full mt-4 sm:rounded-lg rounded-none bg-gray-700 border border-gray-800 min-h-[400px] sm:pb-10 pb-20 h-full px-4 sm:px-10"
      }
    `}
    >
      {type === "movesDetail" && isGenerating && (
        <div className="w-full h-[300px] flex justify-center items-center">
          <Loader />
        </div>
      )}
      {type === "movesDetail" && !isGenerating && <LearningPokemonsContents type={type} />}
      {type === "searchLearningPokemons" && <LearningPokemonsContents type={type} />}
    </section>
  );
}

export default LearningPokemonsSection;
