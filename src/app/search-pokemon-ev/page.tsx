"use client";

import {InitialLoadingScreen} from "@/components/InitialLoadingScreen/InitialLoadingScreen";

import SearchPokemonSection from "../../sections/SearchPokemonSection/SearchPokemonSection";

function SearchPokemonEvPage() {
  return (
    <div className="w-dvw h-dvh overflow-hidden">
      <InitialLoadingScreen />
      <SearchPokemonSection />
    </div>
  );
}

export default SearchPokemonEvPage;
