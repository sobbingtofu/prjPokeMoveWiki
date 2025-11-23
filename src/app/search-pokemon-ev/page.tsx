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
    </>
  );
}

export default SearchPokemonEvPage;
