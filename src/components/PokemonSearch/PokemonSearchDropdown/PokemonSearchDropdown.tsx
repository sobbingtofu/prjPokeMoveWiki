import React, {useEffect, useRef} from "react";
import {useZustandStore} from "@/store/zustandStore";

import PokemonSearchDropdownItem from "./PokemonSearchDropdownItem";

interface PokemonSearchDropdownProps {
  searchType?: "normal" | "ev";
  accentedPokemonIndex?: number;
  sizeType?: "default" | "small";
}

const PokemonSearchDropdown = React.memo(function PokemonSearchDropdown({
  searchType = "ev",
  accentedPokemonIndex,
  sizeType = "default",
}: PokemonSearchDropdownProps) {
  const accentedItemRef = useRef<HTMLDivElement | null>(null);

  const filteredPokemons = useZustandStore((state) => state.filteredPokemons);

  useEffect(() => {
    if (accentedItemRef.current) {
      if (accentedPokemonIndex === 0 || accentedPokemonIndex === filteredPokemons.length - 1) {
        accentedItemRef.current.scrollIntoView({
          behavior: "instant",
          block: "nearest",
        });
      } else {
        accentedItemRef.current.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
        });
      }
    }
  }, [accentedPokemonIndex]);

  return (
    <div
      onMouseDown={(e) => e.preventDefault()}
      className={`absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg 
      overflow-y-auto z-50 scrollbar-thin w-full
      ${sizeType === "small" ? "max-h-60" : "max-h-[450px]"}
      `}
    >
      {filteredPokemons.map((pokemon, index) => (
        <PokemonSearchDropdownItem
          key={pokemon.pokemonId}
          pokemon={pokemon}
          index={index}
          accentedPokemonIndex={accentedPokemonIndex}
          searchType={searchType}
          sizeType={sizeType}
          accentedItemRef={accentedItemRef}
        />
      ))}
    </div>
  );
});

export default PokemonSearchDropdown;
