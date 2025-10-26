"use client";

import {InitialLoadingScreen} from "@/components/InitialLoadingScreen/InitialLoadingScreen";

import SearchSection from "./_sections/SearchSection/SearchSection";
import {useLoadData_DetailedPokemonsArr} from "@/hooks/useLoadData_DetailedPokemonsArr";

function SearchPokemonEvPage() {
  useLoadData_DetailedPokemonsArr();

  return (
    <div className="w-dvw h-dvh overflow-hidden">
      <InitialLoadingScreen />
      <SearchSection />
    </div>
  );
}

export default SearchPokemonEvPage;
