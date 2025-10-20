import {detailedPokemInfoType} from "@/store/type";
import React from "react";
import TypeChip from "../TypeChip/TypeChip";

function PokemonCard({pokemon}: {pokemon: detailedPokemInfoType}) {
  return (
    <div
      key={pokemon.name}
      className="text-sm font-bold px-3 py-2 bg-gray-100 rounded-2xl flex flex-col justify-center items-start gap-2"
    >
      <div className="w-full flex flex-col items-center">
        <div className="flex justify-center items-center w-[100px] h-[100px]">
          <img src={pokemon.spriteUrl} alt={pokemon.koreanName} />
        </div>
        <p className="text-lg">{pokemon.koreanName}</p>
        <div className="w-full flex flex-row justify-center gap-2">
          {pokemon.types.map((type, index) => (
            <TypeChip key={type} type={type} korType={pokemon.koreantypes[index] || ""} textSize="xs" />
          ))}
        </div>
      </div>
      <div>
        {pokemon.moveDetails &&
          pokemon.moveDetails.length > 0 &&
          pokemon.moveDetails.map((moveItem) => (
            <div key={moveItem.moveKorName} className="mb-2">
              <p className="font-bold">{moveItem.moveKorName}</p>
              <div className="flex">
                {moveItem.versionDetails.map((versionDetail, idx) => (
                  <div key={idx} className="ml-2">
                    <p>{versionDetail.versionName}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

export default PokemonCard;
