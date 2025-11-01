import {STAT_LABELS, TYPE_MAP, TYPE_NAME_EN_TO_KO} from "@/store/constantStore";
import TypeChip from "../TypeChip/TypeChip";
import {detailedPokemInfoType} from "@/store/type";
import Image from "next/image";
import React from "react";

const PokemonSearchDropdown = React.memo(function PokemonSearchDropdown({
  pokemons,
}: {
  pokemons: detailedPokemInfoType[];
}) {
  return (
    <div
      onMouseDown={(e) => e.preventDefault()}
      className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg 
      overflow-y-auto z-50 scrollbar-thin w-full max-h-[450px]"
    >
      {pokemons.map((pokemon, index) => (
        <div
          key={pokemon.pokemonId}
          className={`px-4 py-3 hover:bg-gray-100 border-b border-gray-100 last:border-b-0 transition-colors duration-150 h-[120px]
          flex items-center justify-between gap-5
            `}
        >
          <div className="w-[30%] flex items-center gap-2 min-w-[80px]">
            <Image
              src={pokemon.spriteUrl}
              alt={"이미지 로딩중"}
              width={80}
              height={80}
              className="rounded-full hidden md:block"
            />
            <p className="text-gray-900 text-sm ">{pokemon.koreanName}</p>
          </div>
          <div className="w-[60%] flex flex-row justify-end items-center gap-6">
            <div className="text-black text-sm font-bold flex flex-row items-end gap-2 justify-start w-[140px] min-w-[140px]">
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
        </div>
      ))}
    </div>
  );
});

export default PokemonSearchDropdown;
