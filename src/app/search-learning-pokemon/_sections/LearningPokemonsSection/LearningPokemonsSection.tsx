import React from "react";
import LearningPokemonsContents from "./LearningPokemonsContents";

interface LearningPokemonsSectionProps {
  className?: string;
  type?: "searchLearningPokemons" | "movesDetail";
}

function LearningPokemonsSection({className = "", type = "searchLearningPokemons"}: LearningPokemonsSectionProps) {
  return (
    <section
      className={`${className} h-full px-10 pt-7 sm:flex hidden flex-col items-start gap-4 bg-gray-700 
    ${type === "searchLearningPokemons" ? "w-[60%]" : "w-full"}
    `}
    >
      <LearningPokemonsContents />
    </section>
  );
}

export default LearningPokemonsSection;
