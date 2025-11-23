"use client";

import {useZustandStore} from "@/store/zustandStore";

import React, {useEffect, useRef, useState} from "react";
import PokemonSearchDropdown from "../../components/PokemonSearch/PokemonSearchDropdown/PokemonSearchDropdown";
import PokemonSearchInput from "@/components/PokemonSearch/PokemonSearchInput/PokemonSearchInput";
import {detailedPokemInfoType} from "@/store/type";
import {useRouter} from "next/navigation";
import {useLoadData_DetailedPokemonsArr} from "@/hooks/useLoadData_DetailedPokemonsArr";
import PokemonSearch, {SearchPokemonSectionProps} from "@/components/PokemonSearch/PokemonSearch";

function SearchPokemonSection({
  searchType = "ev",
  outSideClickDropdownClose = false,
  enableEnterArrowKeyHandling = false,
}: SearchPokemonSectionProps) {
  const searchContainerRef = useRef<HTMLDivElement>(null);

  return (
    <>
      <section className="w-dvw h-dvh overflow-hidden bg-gray-300 flex flex-col justify-center items-center">
        <div className="md:w-[60%] w-[80%] h-full py-16 flex flex-col items-center gap-y-2 overflow-hidden ">
          <p className="mt-2 w-full text-sm italic text-gray-600 font-bold">
            {searchType === "ev" ? "포켓몬이 주는 노력치를 빠르게 검색" : "포켓몬을 빠르게 검색"}
          </p>

          <PokemonSearch
            searchType={searchType}
            outSideClickDropdownClose={outSideClickDropdownClose}
            enableEnterArrowKeyHandling={enableEnterArrowKeyHandling}
          />
        </div>
      </section>
    </>
  );
}

export default SearchPokemonSection;
