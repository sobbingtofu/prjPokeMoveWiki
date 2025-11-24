import {EvolutionChainVarietyType} from "@/logic/pokeapiLogics/type";
import Image from "next/image";
import React from "react";
import TypeChip from "../TypeChip/TypeChip";
import {useRouter} from "next/navigation";

interface PokemonCardSimplerProps {
  chainItem: EvolutionChainVarietyType;
  className?: string;
}

function PokemonCardSimpler({chainItem, className}: PokemonCardSimplerProps) {
  const router = useRouter();
  const handleDropdownItemClick_searchPokemon = (pokemon: EvolutionChainVarietyType) => {
    console.log("Selected Pokemon:", pokemon);
    router.push(`/pokemons/${pokemon.pokemonId}`);
  };

  return (
    <div
      className={`py-2 px-1.5 border border-gray-500 flex flex-col justify-center items-center select-none ${className}`}
    >
      <div
        className="w-full flex justify-center items-center cursor-pointer text-gray-300
        hover:scale-[1.05] hover:text-white duration-200 transition-transform"
        onClick={() => handleDropdownItemClick_searchPokemon(chainItem)}
      >
        <div className="md:w-[70px] w-[45px] flex-3 flex justify-end items-center">
          <Image
            src={chainItem.spriteUrl || ""}
            alt={chainItem.pokemonVarietyNameKo || "Pokemon"}
            content="fit"
            width={"80"}
            height={"80"}
          />
        </div>
        <div className="flex flex-col gap-1.5 flex-4">
          <div className="flex flex-col gap-0 items-start">
            <p className="sm:text-sm text-xs font-bold ">{chainItem.pokemonSpeciesNameKo}</p>
            {chainItem.varietyKeyword && (
              <p className="sm:text-[11px] text-[10px] font-bold">{"(" + chainItem.varietyKeyword + " 리전폼)"}</p>
            )}
          </div>
          <div className="flex flex-row gap-1">
            {chainItem.types.map((type, index) => {
              return <TypeChip key={index} type={type.type.name} textSize="2xs" />;
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PokemonCardSimpler;
