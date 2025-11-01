"use client";

import {useLoadData_PokemonsEV} from "@/hooks/useLoadData_PokemonsEV";
import {useZustandStore} from "@/store/zustandStore";

import React, {useEffect, useRef, useState} from "react";
import PokemonSearchDropdown from "../../components/PokemonSearchDropdown/PokemonSearchDropdown";
import PokemonSearchInput from "@/components/PokemonSearchInput/PokemonSearchInput";

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

  const [accentedMoveIndex, setAccentedMoveIndex] = useState<number>(-1);

  useLoadData_PokemonsEV();

  useEffect(() => {
    if (outSideClickDropdownClose) {
      const handleClickOutside = (event: MouseEvent) => {
        if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
          setIsPokemonDropdownOpen(false);
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [setIsPokemonDropdownOpen]);

  return (
    <>
      <section className="w-dvw h-dvh overflow-hidden bg-gray-300 flex flex-col justify-center items-center">
        <div className="md:w-[60%] w-[80%] h-full py-16 flex flex-col items-center gap-y-2 overflow-hidden ">
          <p className="mt-2 w-full text-sm italic text-gray-600 font-bold">
            {searchType === "ev" ? "포켓몬이 주는 노력치를 빠르게 검색" : "포켓몬을 빠르게 검색"}
          </p>
          <div className="relative w-full font-black">
            {/* 검색창 */}
            <PokemonSearchInput
              accentedMoveIndex={accentedMoveIndex}
              setAccentedMoveIndex={setAccentedMoveIndex}
              searchValue={searchValue}
              setSearchValue={setSearchValue}
              searchContainerRef={searchContainerRef}
              setIsPokemonDropdownOpen={setIsPokemonDropdownOpen}
              enableEnterArrowKeyHandling={enableEnterArrowKeyHandling}
            />

            {/* 드롭다운 결과 */}
            {isPokemonDropdownOpen && (
              <PokemonSearchDropdown searchType={searchType} accentedMoveIndex={accentedMoveIndex} />
            )}
          </div>
        </div>
      </section>
    </>
  );
}

export default SearchPokemonSection;
