import {STAT_LABELS, TYPE_MAP} from "@/store/constantStore";
import TypeChip from "../TypeChip/TypeChip";
import Image from "next/image";
import React, {useEffect, useRef} from "react";
import {useZustandStore} from "@/store/zustandStore";

interface PokemonSearchDropdownProps {
  searchType?: "normal" | "ev";
  accentedPokemonIndex?: number;
}

const PokemonSearchDropdown = React.memo(function PokemonSearchDropdown({
  searchType = "ev",
  accentedPokemonIndex: accentedPokemonIndex,
}: PokemonSearchDropdownProps) {
  const accentedItemRef = useRef<HTMLDivElement | null>(null);

  const filteredPokemons = useZustandStore((state) => state.filteredPokemons);

  useEffect(() => {
    if (accentedItemRef.current) {
      if (accentedPokemonIndex === 0 || accentedPokemonIndex === filteredPokemons.length - 1) {
        accentedItemRef.current.scrollIntoView({
          behavior: "instant",
          block: "nearest",
        });
      } else {
        accentedItemRef.current.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
        });
      }
    }
  }, [accentedPokemonIndex]);

  return (
    <div
      onMouseDown={(e) => e.preventDefault()}
      className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg 
      overflow-y-auto z-50 scrollbar-thin w-full max-h-[450px]"
    >
      {filteredPokemons.map((pokemon, index) => (
        <div
          key={pokemon.pokemonId}
          className={`px-4 py-3 hover:bg-gray-100 border-b border-gray-100 last:border-b-0 transition-colors duration-150 h-[120px]
          flex items-center justify-between gap-5
          ${index === accentedPokemonIndex ? "bg-cyan-100" : ""}
          ${searchType === "normal" ? "cursor-pointer" : ""}
            `}
          ref={index === accentedPokemonIndex ? accentedItemRef : null}
        >
          <div
            className={
              searchType === "ev"
                ? `w-[30%] flex items-center gap-2 min-w-[80px]`
                : "w-full flex items-center gap-2 min-w-[80px]"
            }
          >
            <Image
              src={pokemon.spriteUrl}
              alt={"이미지 로딩중"}
              width={80}
              height={80}
              className={searchType === "ev" ? "rounded-full hidden md:block" : "rounded-full block"}
            />
            <p className="text-gray-900 text-sm ">{pokemon.koreanName}</p>
          </div>

          {searchType === "ev" && (
            <div className="w-[60%] flex flex-row justify-end items-center gap-3">
              <div className="text-black text-sm font-bold flex flex-row items-end gap-1 justify-start w-[140px] min-w-[140px]">
                {pokemon.evStats?.map((evStat) => {
                  return STAT_LABELS.map((stat) => {
                    if (stat.statName === evStat.statName) {
                      return <p className="w-[66px]" key={stat.statName}>{`${stat.label} +${evStat.evValue}`}</p>;
                    }
                  });
                })}
              </div>

              <div className="flex w-[138px] min-w-[138px] gap-2 justify-end">
                {pokemon.types.map((type) => (
                  <TypeChip
                    key={type}
                    type={type}
                    // korType={TYPE_NAME_EN_TO_KO.find((item) => item.typeName === type)?.korTypeName || type}
                    korType={TYPE_MAP[type] || type}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
});

export default PokemonSearchDropdown;
