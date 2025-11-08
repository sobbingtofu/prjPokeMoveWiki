import React, {useCallback, useEffect, useRef, useState} from "react";
import {CloseIcon} from "../CloseIcon/CloseIcon";
import {Loader} from "../Loader/Loader";
import {detailedPokemInfoType} from "@/store/type";
import {useZustandStore} from "@/store/zustandStore";

interface PokemonSearchInputProps {
  searchValue: string;
  setSearchValue: React.Dispatch<React.SetStateAction<string>>;

  setIsPokemonDropdownOpen: (update: boolean) => void;
  enableEnterArrowKeyHandling?: boolean;

  accentedPokemonIndex: number;
  setAccentedPokemonIndex: React.Dispatch<React.SetStateAction<number>>;
}

function PokemonSearchInput({
  searchValue,
  setSearchValue,

  setIsPokemonDropdownOpen,
  enableEnterArrowKeyHandling = false,

  accentedPokemonIndex,
  setAccentedPokemonIndex,
}: PokemonSearchInputProps) {
  const [isDebouncing, setIsDebouncing] = useState(false);

  const inputValueRef = useRef<HTMLInputElement>(null); // 실시간 입력값 관리 ref
  const inputDebounceRef = useRef<NodeJS.Timeout | null>(null);
  const lastArrowKeyTime = useRef<number>(0);
  const arrowKeyThrottleDelay = 80;

  const filteredPokemons = useZustandStore((state) => state.filteredPokemons);
  const setFilteredPokemons = useZustandStore((state) => state.setFilteredPokemons);
  const detailedPokemons = useZustandStore((state) => state.detailedPokemons);

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

  // 작성 필요
  const handleDropdownItemClick_searchPokemon = (accentedPokemon: detailedPokemInfoType) => {};

  const handleEnterKeyDown = () => {
    setIsDebouncing(false);
    if (filteredPokemons.length > 0 && accentedPokemonIndex === -1) {
      setAccentedPokemonIndex(0);
    } else if (filteredPokemons.length > 0 && accentedPokemonIndex >= 0) {
      const accentedPokemon = filteredPokemons[accentedPokemonIndex];
      if (accentedPokemon && accentedPokemonIndex >= 0) {
        handleDropdownItemClick_searchPokemon(accentedPokemon);
      }
    }
  };

  useEffect(() => {
    console.log("Updated Filtered Pokemons in SearchInput:", filteredPokemons);
  }, [filteredPokemons]);

  const handleArrowKeyDown = (arrow: "ArrowDown" | "ArrowUp") => {
    console.log("handleArrowKeyDown called");
    console.log("Current accentedMoveIndex:", accentedPokemonIndex);
    console.log("Filtered Pokemons:", filteredPokemons);

    setIsDebouncing(false);
    if (filteredPokemons.length > 0) {
      const currentTime = Date.now();
      if (currentTime - lastArrowKeyTime.current > arrowKeyThrottleDelay) {
        if (arrow === "ArrowDown") {
          if (accentedPokemonIndex < filteredPokemons.length - 1) {
            setAccentedPokemonIndex((prev) => prev + 1);
          } else {
            setAccentedPokemonIndex(0);
          }
        } else if (arrow === "ArrowUp") {
          if (accentedPokemonIndex > 0) {
            setAccentedPokemonIndex((prev) => prev - 1);
          } else {
            setAccentedPokemonIndex(filteredPokemons.length - 1);
          }
        }

        lastArrowKeyTime.current = currentTime;
      }
      console.log("accentedMoveIndexRef.current:", accentedPokemonIndex);
    }
  };

  const handleKeyDownSearchInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    console.log("Key pressed:", e.key);

    if (enableEnterArrowKeyHandling) {
      if (e.key === "Enter") {
        handleEnterKeyDown();
      } else if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        e.preventDefault();
        handleArrowKeyDown(e.key);
      } else {
        setIsDebouncing(true);
        setAccentedPokemonIndex(-1);

        if (inputDebounceRef.current) {
          clearTimeout(inputDebounceRef.current);
        }

        inputDebounceRef.current = setTimeout(() => {
          setSearchValue(inputValueRef.current?.value || "");
          setIsDebouncing(false);
        }, 200);
      }
    } else {
      setIsDebouncing(true);

      if (inputDebounceRef.current) {
        clearTimeout(inputDebounceRef.current);
      }

      inputDebounceRef.current = setTimeout(() => {
        setSearchValue(inputValueRef.current?.value || "");
        setIsDebouncing(false);
      }, 200);
    }
  };

  const handleClickCloseIcon = () => {
    if (inputValueRef.current) inputValueRef.current.value = "";
    setSearchValue("");
    if (inputValueRef.current) {
      inputValueRef.current.value = "";
    }
  };

  return (
    <div
      className="bg-white px-6 py-4 flex justify-between items-center shadow-sm
               focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500
               w-full text-lg border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500
               focus:ring-2 focus:ring-blue-200 transition-all duration-200
               overflow-hidden"
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
