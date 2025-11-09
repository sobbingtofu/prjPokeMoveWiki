"use client";

import {InitialLoadingScreen} from "@/components/InitialLoadingScreen/InitialLoadingScreen";

import SearchPokemonSection from "../../sections/SearchPokemonSection/SearchPokemonSection";
import {useEffect} from "react";
import {redirect} from "next/navigation";

function SearchPokemonEvPage() {
  useEffect(() => {
    setTimeout(() => {
      redirect("/search-pokemons");
    }, 100);
  }, []);
  return (
    <>
      <InitialLoadingScreen />
      {/* <div className="w-dvw h-dvh overflow-hidden">
        <InitialLoadingScreen />
        <SearchPokemonSection />
      </div> */}
    </>
  );
}

export default SearchPokemonEvPage;
