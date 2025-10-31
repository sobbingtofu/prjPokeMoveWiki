"use client";

import {CloseIcon} from "@/components/CloseIcon/CloseIcon";
import {Loader} from "@/components/Loader/Loader";
import {useLoadData_PokemonsEV} from "@/hooks/useLoadData_PokemonsEV";
import {useZustandStore} from "@/store/zustandStore";

import React, {useEffect, useRef, useState} from "react";
import PokemonSearchDropdown from "../../_components/PokemonSearchDropdown/PokemonSearchDropdown";

function SearchSection() {
  const isPokemonDropdownOpen = useZustandStore((state) => state.isPokemonDropdownOpen);
  const setIsPokemonDropdownOpen = useZustandStore((state) => state.setIsPokemonDropdownOpen);
  const detailedPokemons = useZustandStore((state) => state.detailedPokemons);

  const [isDebouncing, setIsDebouncing] = useState(false);

  const [searchValue, setSearchValue] = useState("");

  const [filteredPokemons, setFilteredPokemons] = useState<typeof detailedPokemons>([]);

  const inputValueRef = useRef<string>(""); // 실시간 입력값 관리 ref

  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    inputValueRef.current = e.target.value; // ref에 실시간 값 저장
  };

  const handleKeyDownInMoveSearchInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    setIsDebouncing(true);
    // 기존 타이머 클리어
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    // 0.2초 후 searchValue 업데이트
    debounceRef.current = setTimeout(() => {
      setSearchValue(inputValueRef.current);
      setIsDebouncing(false);
    }, 200);
  };

  const handleClickCloseIcon = () => {
    inputValueRef.current = "";
    setSearchValue("");
    const inputElement = searchContainerRef.current?.querySelector("input");
    if (inputElement) {
      inputElement.value = "";
    }
  };
  return (
    <>
      <section className="w-dvw h-dvh overflow-hidden bg-gray-300 flex flex-col justify-center items-center">
        <div className="md:w-[60%] w-[80%] h-full py-16 flex flex-col items-center gap-y-2 overflow-hidden ">
          <p className="mt-2 w-full text-sm italic text-gray-600 font-bold">포켓몬이 주는 노력치를 빠르게 검색</p>
          <div className="relative w-full font-black">
            {/* 검색창 */}
            <div
              className="bg-white px-6 py-4 flex justify-between items-center shadow-sm
               focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500
               w-full text-lg border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500
               focus:ring-2 focus:ring-blue-200 transition-all duration-200
               overflow-hidden"
              ref={searchContainerRef}
            >
              <input
                autoFocus
                type="text"
                onChange={handleInputChange}
                onKeyDown={handleKeyDownInMoveSearchInput}
                placeholder="포켓몬의 이름을 입력"
                className=" w-full focus:outline-none bg-transparent"
                onBlur={(e) => {
                  e.preventDefault();
                }}
              />
              {isDebouncing && <Loader />}
              {!isDebouncing && searchValue.trim() !== "" && <CloseIcon onClick={handleClickCloseIcon} />}
            </div>
            {/* 드롭다운 결과 */}
            {isPokemonDropdownOpen && <PokemonSearchDropdown pokemons={filteredPokemons} />}
          </div>
        </div>
      </section>
    </>
  );
}

export default SearchSection;
