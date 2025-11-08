"use client";

import {useZustandStore} from "@/store/zustandStore";

import React, {useEffect, useRef, useState} from "react";
import PokemonSearchDropdown from "../../components/PokemonSearchDropdown/PokemonSearchDropdown";
import PokemonSearchInput from "@/components/PokemonSearchInput/PokemonSearchInput";
import {detailedPokemInfoType} from "@/store/type";
import {useRouter} from "next/navigation";
import {useLoadData_DetailedPokemonsArr} from "@/hooks/useLoadData_DetailedPokemonsArr";

interface SearchPokemonSectionProps {
  searchType?: "normal" | "ev";
  outSideClickDropdownClose?: boolean;
  enableEnterArrowKeyHandling?: boolean;
}

function SearchPokemonSection({
  searchType = "ev",
  outSideClickDropdownClose = false,
  enableEnterArrowKeyHandling = false,
}: SearchPokemonSectionProps) {
  const isPokemonDropdownOpen = useZustandStore((state) => state.isPokemonDropdownOpen);
  const setIsPokemonDropdownOpen = useZustandStore((state) => state.setIsPokemonDropdownOpen);

  const [searchValue, setSearchValue] = useState("");
  const searchContainerRef = useRef<HTMLDivElement>(null);

  const [accentedPokemonIndex, setAccentedPokemonIndex] = useState<number>(-1);

  useLoadData_DetailedPokemonsArr();

  useEffect(() => {
    if (outSideClickDropdownClose) {
      const handleClickOutside = (event: MouseEvent) => {
        if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
          setIsPokemonDropdownOpen(false);
          setAccentedPokemonIndex(-1);
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [setIsPokemonDropdownOpen]);

  const router = useRouter();

  const handleDropdownItemClick_searchPokemon = (accentedPokemon: detailedPokemInfoType) => {
    if (searchType === "normal") {
      console.log("Selected Pokemon:", accentedPokemon);
      router.push(`/pokemons/${accentedPokemon.pokemonId}`);
    }
  };

  return (
    <>
      <section className="w-dvw h-dvh overflow-hidden bg-gray-300 flex flex-col justify-center items-center">
        <div className="md:w-[60%] w-[80%] h-full py-16 flex flex-col items-center gap-y-2 overflow-hidden ">
          <p className="mt-2 w-full text-sm italic text-gray-600 font-bold">
            {searchType === "ev" ? "포켓몬이 주는 노력치를 빠르게 검색" : "포켓몬을 빠르게 검색"}
          </p>
          <div className="relative w-full h-min font-black" ref={searchContainerRef}>
            {/* 검색창 */}
            <PokemonSearchInput
              handleDropdownItemClick_searchPokemon={handleDropdownItemClick_searchPokemon}
              accentedPokemonIndex={accentedPokemonIndex}
              setAccentedPokemonIndex={setAccentedPokemonIndex}
              searchValue={searchValue}
              setSearchValue={setSearchValue}
              setIsPokemonDropdownOpen={setIsPokemonDropdownOpen}
              enableEnterArrowKeyHandling={enableEnterArrowKeyHandling}
            />

            {/* 드롭다운 결과 */}
            {isPokemonDropdownOpen && (
              <PokemonSearchDropdown
                searchType={searchType}
                accentedPokemonIndex={accentedPokemonIndex}
                handleDropdownItemClick_searchPokemon={handleDropdownItemClick_searchPokemon}
              />
            )}
          </div>
        </div>
      </section>
    </>
  );
}

export default SearchPokemonSection;
