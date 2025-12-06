import {pokemonTypeEnNames, pokemonTypeKorNames} from "@/logic/pokeapiLogics/type";
import React from "react";
import TypeChip from "./TypeChip";

interface TypeChipContainerProps {
  types: pokemonTypeEnNames[];
  koreantypes: pokemonTypeKorNames[];
  justifyContent?: "center" | "start" | "end";
}

function TypeChipContainer({types, koreantypes, justifyContent = "center"}: TypeChipContainerProps) {
  return (
    <div className={`w-full flex flex-row justify-${justifyContent} gap-2 mt-1`}>
      {types.map((type, index) => (
        <TypeChip key={type} type={type} korType={koreantypes[index] || ""} textSize="xs" />
      ))}
    </div>
  );
}

export default TypeChipContainer;
