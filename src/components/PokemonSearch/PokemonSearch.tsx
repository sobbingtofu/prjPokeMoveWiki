import React, {useEffect, useRef, useState} from "react";
import PokemonSearchInput from "./PokemonSearchInput/PokemonSearchInput";
import PokemonSearchDropdown from "./PokemonSearchDropdown/PokemonSearchDropdown";
import {useZustandStore} from "@/store/zustandStore";
import {useLoadData_DetailedPokemonsArr} from "@/hooks/useLoadData_DetailedPokemonsArr";

export interface SearchPokemonSectionProps {
  searchType?: "normal" | "ev";
  outSideClickDropdownClose?: boolean;
  enableEnterArrowKeyHandling?: boolean;
  sizeType?: "default" | "small";
}

function PokemonSearch({
  searchType = "ev",
  outSideClickDropdownClose = false,
  enableEnterArrowKeyHandling = false,
  sizeType = "default",
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

  return (
    <>
      <div className="relative w-full h-min font-black" ref={searchContainerRef}>
        {/* 검색창 */}
        <PokemonSearchInput
          sizeType={sizeType}
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
            sizeType={sizeType}
            searchType={sizeType == "small" ? "normal" : searchType}
            accentedPokemonIndex={accentedPokemonIndex}
          />
        )}
      </div>
    </>
  );
}

export default PokemonSearch;
