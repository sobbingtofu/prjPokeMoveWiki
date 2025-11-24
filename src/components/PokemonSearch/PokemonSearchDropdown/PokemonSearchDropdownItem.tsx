import TypeChipContainer from "@/components/TypeChip/TypeChipContainer";
import useHandleDropdownItemClick_searchPokemon from "@/hooks/useHandleDropdownItemClick_searchPokemon";
import {STAT_LABELS} from "@/store/constantStore";
import {detailedPokemInfoType} from "@/store/type";
import Image from "next/image";
import {useRouter} from "next/navigation";
import React, {RefObject} from "react";

interface PokemonSearchDropdownItemProps {
  pokemon: detailedPokemInfoType;
  index: number;
  accentedPokemonIndex?: number;

  searchType?: "normal" | "ev";
  sizeType?: "default" | "small";
  accentedItemRef?: RefObject<HTMLDivElement | null>;
}

function PokemonSearchDropdownItem({
  pokemon,
  index,
  accentedPokemonIndex,

  searchType,
  sizeType,
  accentedItemRef,
}: PokemonSearchDropdownItemProps) {
  const handleDropdownItemClick_searchPokemon = useHandleDropdownItemClick_searchPokemon();

  return (
    <div
      key={pokemon.pokemonId}
      className={`px-4 py-3 hover:bg-gray-100 border-b border-gray-100 last:border-b-0 transition-colors duration-150
          flex items-center justify-between gap-5
          ${index === accentedPokemonIndex ? "bg-cyan-100" : ""}
          ${searchType === "normal" ? "cursor-pointer" : ""}
          ${sizeType === "small" ? "h-20" : "h-[120px]"}
          `}
      ref={index === accentedPokemonIndex ? accentedItemRef : null}
    >
      <div
        className={`w-[30%] flex items-center gap-2 min-w-20`}
        onClick={() => handleDropdownItemClick_searchPokemon(pokemon)}
      >
        <Image
          src={pokemon.spriteUrl}
          alt={"이미지 로딩중"}
          width={60}
          height={60}
          className={"rounded-full hidden md:block"}
        />
        <p className="text-gray-900 text-sm ">{pokemon.koreanName}</p>
      </div>

      {
        <div className="w-[60%] flex flex-row justify-end items-center gap-10">
          {searchType === "ev" && (
            <div className="text-gray-800 text-xs font-bold flex flex-col items-end gap-1 justify-start w-[70px] min-w-[70px]">
              {pokemon.evStats?.map((evStat) => {
                return STAT_LABELS.map((stat) => {
                  if (stat.statName === evStat.statName) {
                    return <p className="w-[66px]" key={stat.statName}>{`${stat.label} +${evStat.evValue}`}</p>;
                  }
                });
              })}
            </div>
          )}
          <TypeChipContainer types={pokemon.types} koreantypes={pokemon.koreantypes} justifyContent="end" />
        </div>
      }
    </div>
  );
}

export default PokemonSearchDropdownItem;
