import React, {useCallback, useEffect, useRef, useState} from "react";
import {CloseIcon} from "../CloseIcon/CloseIcon";
import {Loader} from "../Loader/Loader";
import {useZustandStore} from "@/store/zustandStore";
import {detailedPokemInfoType} from "@/store/type";

interface PokemonSearchInputProps {
  filteredPokemons: detailedPokemInfoType[];
  setFilteredPokemons: React.Dispatch<React.SetStateAction<detailedPokemInfoType[]>>;
  searchValue: string;
  setSearchValue: React.Dispatch<React.SetStateAction<string>>;
}

function PokemonSearchInput({setFilteredPokemons, searchValue, setSearchValue}: PokemonSearchInputProps) {
  const [isDebouncing, setIsDebouncing] = useState(false);

  const inputValueRef = useRef<HTMLInputElement>(null); // 실시간 입력값 관리 ref
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  const handleKeyDownSearchInput = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      setIsDebouncing(true);

      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }

      debounceRef.current = setTimeout(() => {
        setSearchValue(inputValueRef.current?.value || "");
        setIsDebouncing(false);
      }, 200);
    },
    [setSearchValue]
  );

  const handleClickCloseIcon = () => {
    if (inputValueRef.current) inputValueRef.current.value = "";
    setSearchValue("");
    const inputElement = searchContainerRef.current?.querySelector("input");
    if (inputElement) {
      inputElement.value = "";
    }
  };

  return (
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
        ref={inputValueRef}
        onKeyDown={handleKeyDownSearchInput}
        placeholder="포켓몬의 이름을 입력"
        className=" w-full focus:outline-none bg-transparent"
        onBlur={(e) => {
          e.preventDefault();
        }}
      />
      {isDebouncing && <Loader />}
      {!isDebouncing && searchValue.trim() !== "" && <CloseIcon onClick={handleClickCloseIcon} />}
    </div>
  );
}

export default PokemonSearchInput;
