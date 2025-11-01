"use client";

import {InitialLoadingScreen} from "@/components/InitialLoadingScreen/InitialLoadingScreen";

import SearchSection from "../../sections/SearchPokemonSection/SearchPokemonSection";
import {useLoadData_DetailedPokemonsArr} from "@/hooks/useLoadData_DetailedPokemonsArr";

function SearchPokemonEvPage() {
  return (
    <div className="w-dvw h-dvh overflow-hidden">
      <InitialLoadingScreen />
      <SearchSection />
    </div>
  );
}

export default SearchPokemonEvPage;
