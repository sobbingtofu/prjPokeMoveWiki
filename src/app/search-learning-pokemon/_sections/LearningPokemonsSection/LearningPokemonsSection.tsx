"use client";

import React, {useEffect} from "react";
import LearningPokemonsContents from "./LearningPokemonsContents";
import {useZustandStore} from "@/store/zustandStore";
import useGenerateSingleMoveLearningPokemons from "@/hooks/useGenerateSingleMoveLearningPokemons";
import {selectedMoveType} from "@/store/type";

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

  const currentMove = koreanMovesArrayStates.find((p) => p.id == parseInt(currentMoveId || "")) || null;

  const {generateSingleMoveLearningPokemons, isGenerating} = useGenerateSingleMoveLearningPokemons();

  const editedCurrentMove: selectedMoveType | null = currentMove
    ? {...currentMove, isSelectedForDeletion: false}
    : null;

  useEffect(() => {
    if (editedCurrentMove || !isGenerating) {
      generateSingleMoveLearningPokemons(editedCurrentMove);
    }
  }, [currentMoveId]);

  return (
    <section
      className={`${className}  px-10 pt-7 sm:flex hidden flex-col items-start gap-4 
      ${
        type === "searchLearningPokemons"
          ? "w-[60%] bg-gray-700 h-full"
          : "w-full mt-4 rounded-lg bg-gray-700 border border-gray-800 min-h-[400px] pb-10"
      }
    `}
    >
      <LearningPokemonsContents type={type} />
    </section>
  );
}

export default LearningPokemonsSection;
