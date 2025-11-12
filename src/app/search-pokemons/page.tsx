import {InitialLoadingScreen} from "@/components/InitialLoadingScreen/InitialLoadingScreen";
import SearchPokemonSection from "@/sections/SearchPokemonSection/SearchPokemonSection";
import React from "react";

function SearchPokemonsPage() {
  return (
    <div className="w-dvw">
      <InitialLoadingScreen />
      <SearchPokemonSection searchType="normal" enableEnterArrowKeyHandling={true} outSideClickDropdownClose={true} />
    </div>
  );
}

export default SearchPokemonsPage;
