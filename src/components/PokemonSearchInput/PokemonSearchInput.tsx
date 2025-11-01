import React, {useCallback, useEffect, useRef, useState} from "react";
import {CloseIcon} from "../CloseIcon/CloseIcon";
import {Loader} from "../Loader/Loader";
import {detailedPokemInfoType} from "@/store/type";
import {useZustandStore} from "@/store/zustandStore";

interface PokemonSearchInputProps {
  searchValue: string;
  setSearchValue: React.Dispatch<React.SetStateAction<string>>;
  searchContainerRef: React.RefObject<HTMLDivElement | null>;
  setIsPokemonDropdownOpen: (update: boolean) => void;
  enableEnterArrowKeyHandling?: boolean;

  accentedMoveIndex: number;
  setAccentedMoveIndex: React.Dispatch<React.SetStateAction<number>>;
}

function PokemonSearchInput({
  searchValue,
  setSearchValue,
  searchContainerRef,
  setIsPokemonDropdownOpen,
  enableEnterArrowKeyHandling = false,

  accentedMoveIndex,
  setAccentedMoveIndex,
}: PokemonSearchInputProps) {
  const [isDebouncing, setIsDebouncing] = useState(false);

  const inputValueRef = useRef<HTMLInputElement>(null); // 실시간 입력값 관리 ref
  const inputDebounceRef = useRef<NodeJS.Timeout | null>(null);
  const lastArrowKeyTime = useRef<number>(0);
  const arrowKeyThrottleDelay = 80;

  const filteredPokemons = useZustandStore((state) => state.filteredPokemons);
  const setFilteredPokemons = useZustandStore((state) => state.setFilteredPokemons);
  const detailedPokemons = useZustandStore((state) => state.detailedPokemons);

  // 작성 필요
  const handlePokemonSearchButtonClick = () => {};

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
  const handleDropdownItemClick_searchPokemon = (accentedMove: detailedPokemInfoType) => {};

  const handleEnterKeyDown = () => {
    setIsDebouncing(false);
    if (filteredPokemons.length > 0 && accentedMoveIndex === -1) {
      setAccentedMoveIndex(0);
    } else if (filteredPokemons.length > 0 && accentedMoveIndex >= 0) {
      const accentedMove = filteredPokemons[accentedMoveIndex];
      if (accentedMove) {
        handleDropdownItemClick_searchPokemon(accentedMove);
        // 초기화
        // enterKeyPressedCounRef.current = 0;
      }
    }
  };

  useEffect(() => {
    console.log("Updated Filtered Pokemons in SearchInput:", filteredPokemons);
  }, [filteredPokemons]);

  const handleArrowKeyDown = (arrow: "ArrowDown" | "ArrowUp") => {
    console.log("handleArrowKeyDown called");
    console.log("Current accentedMoveIndex:", accentedMoveIndex);
    console.log("Filtered Pokemons:", filteredPokemons);

    setIsDebouncing(false);
    if (filteredPokemons.length > 0) {
      const currentTime = Date.now();
      if (currentTime - lastArrowKeyTime.current > arrowKeyThrottleDelay) {
        if (arrow === "ArrowDown") {
          if (accentedMoveIndex < filteredPokemons.length - 1) {
            setAccentedMoveIndex((prev) => prev + 1);
          } else {
            setAccentedMoveIndex(0);
          }
        } else if (arrow === "ArrowUp") {
          if (accentedMoveIndex > 0) {
            setAccentedMoveIndex((prev) => prev - 1);
          } else {
            setAccentedMoveIndex(filteredPokemons.length - 1);
          }
        }

        lastArrowKeyTime.current = currentTime;
      }
      console.log("accentedMoveIndexRef.current:", accentedMoveIndex);
    }
  };

  const handleKeyDownSearchInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    console.log("Key pressed:", e.key);
    if (enableEnterArrowKeyHandling) {
      if (e.key === "Enter") {
        if (e.ctrlKey) {
          setAccentedMoveIndex(-1);
          setIsPokemonDropdownOpen(false);
          handlePokemonSearchButtonClick();
        } else {
          handleEnterKeyDown();
        }
      } else if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        e.preventDefault();
        handleArrowKeyDown(e.key);
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
    if (searchContainerRef) {
      const inputElement = searchContainerRef.current?.querySelector("input");
      if (inputElement) {
        inputElement.value = "";
      }
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
