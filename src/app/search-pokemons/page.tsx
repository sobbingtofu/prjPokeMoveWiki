import PokemonSearchDropdown from "@/components/PokemonSearchDropdown/PokemonSearchDropdown";
import React from "react";

function SearchPokemonsPage() {
  return (
    <section className="w-screen h-screen flex flex-col items-center justify-start">
      <PokemonSearchDropdown pokemons={[]} />
    </section>
  );
}

export default SearchPokemonsPage;
