import React from "react";
import LearningPokemonsContents from "./LearningPokemonsContents";

interface LearningPokemonsSectionProps {
  className?: string;
}

function LearningPokemonsSection({className = ""}: LearningPokemonsSectionProps) {
  return (
    <section className={`${className} h-full px-10 pt-7 sm:flex hidden flex-col items-start gap-4 bg-gray-700 w-[60%]`}>
      <LearningPokemonsContents />
    </section>
  );
}

export default LearningPokemonsSection;
