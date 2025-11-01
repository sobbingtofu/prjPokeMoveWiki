"use client";

import {useLoadData_PokemonsEV} from "@/hooks/useLoadData_PokemonsEV";
import {useZustandStore} from "@/store/zustandStore";

import React, {useEffect, useRef, useState} from "react";
import PokemonSearchDropdown from "../../components/PokemonSearchDropdown/PokemonSearchDropdown";
import PokemonSearchInput from "@/components/PokemonSearchInput/PokemonSearchInput";

function SearchPokemonSection() {
  const isPokemonDropdownOpen = useZustandStore((state) => state.isPokemonDropdownOpen);
  const setIsPokemonDropdownOpen = useZustandStore((state) => state.setIsPokemonDropdownOpen);
  const detailedPokemons = useZustandStore((state) => state.detailedPokemons);

  const [searchValue, setSearchValue] = useState("");

  const [filteredPokemons, setFilteredPokemons] = useState<typeof detailedPokemons>([]);

  useLoadData_PokemonsEV();

  useEffect(() => {
    if (searchValue.trim() === "") {
      setFilteredPokemons([]);
      setIsPokemonDropdownOpen(false);
      return;
    }

    const filtered = detailedPokemons.filter((pokemon) =>
      pokemon.koreanName.toLowerCase().includes(searchValue.toLowerCase())
    );
    // setFilteredMoves(filtered.slice(0, 60));
    setFilteredPokemons(filtered);
    setIsPokemonDropdownOpen(filtered.length > 0);

    console.log("Filtered Pokemons:", filtered);
  }, [searchValue, detailedPokemons]);

  return (
    <>
      <section className="w-dvw h-dvh overflow-hidden bg-gray-300 flex flex-col justify-center items-center">
        <div className="md:w-[60%] w-[80%] h-full py-16 flex flex-col items-center gap-y-2 overflow-hidden ">
          <p className="mt-2 w-full text-sm italic text-gray-600 font-bold">포켓몬이 주는 노력치를 빠르게 검색</p>
          <div className="relative w-full font-black">
            {/* 검색창 */}
            <PokemonSearchInput
              filteredPokemons={filteredPokemons}
              setFilteredPokemons={setFilteredPokemons}
              searchValue={searchValue}
              setSearchValue={setSearchValue}
            />
            {/* 드롭다운 결과 */}
            {isPokemonDropdownOpen && <PokemonSearchDropdown pokemons={filteredPokemons} />}
          </div>
        </div>
      </section>
    </>
  );
}

export default SearchPokemonSection;
