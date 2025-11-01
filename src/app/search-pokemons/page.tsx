import {InitialLoadingScreen} from "@/components/InitialLoadingScreen/InitialLoadingScreen";
import PokemonSearchDropdown from "@/components/PokemonSearchDropdown/PokemonSearchDropdown";
import SearchPokemonSection from "@/sections/SearchPokemonSection/SearchPokemonSection";
import React from "react";

function SearchPokemonsPage() {
  return (
    <div className="w-dvw h-dvh overflow-hidden">
      <InitialLoadingScreen />
      <SearchPokemonSection searchType="normal" enableEnterArrowKeyHandling={true} />
    </div>
  );
}

export default SearchPokemonsPage;
