"use client";
import {fetchPokemonAbilityData} from "@/logic/pokeapiLogics/fetchMovePokemonLogics";
import {pokemonTypeEnNames} from "@/logic/pokeapiLogics/type";
import {detailedPokemInfoType} from "@/store/type";
import {useQuery} from "@tanstack/react-query";
import React, {useEffect} from "react";

interface AbilityGridProps {
  types: pokemonTypeEnNames[];
  abilities: detailedPokemInfoType["abilities"];
}

function AbilityGrid({types, abilities}: AbilityGridProps) {
  const {data: abilitiesData, isLoading: isAbilitiesLoading} = useQuery({
    queryKey: ["abilities", abilities],
    queryFn: () => fetchPokemonAbilityData(abilities!),
    staleTime: Infinity,
    gcTime: Infinity,
  });

  return (
    <div className="w-full bg-gray-900 text-white">
      {/* Header */}
      <div className={`bg-${types[0].toLowerCase()} px-4 py-2 text-sm w-full font-bold flex justify-center`}>
        {"특성 (숨겨진 특성은 *)"}
      </div>

      {isAbilitiesLoading && (
        <div className="w-full flex justify-center items-center py-4">
          <p>특성 정보를 불러오는 중...</p>
        </div>
      )}

      {/* Content */}
      {abilitiesData && (
        <div>
          {abilitiesData.map((ability, index) => {
            return (
              ability && (
                <div key={index} className="flex border border-gray-700 text-sm">
                  <div className="flex-2 border border-gray-700 flex justify-center items-center py-2 px-2 font-bold min-h-[45px]">
                    <p className="text-center">
                      {ability.hidden ? "* " : ""}
                      {ability.abilityNameKo}
                    </p>
                  </div>
                  <div className="flex-8 border border-gray-700 flex justify-start items-center py-2 px-4 min-h-[45px]">
                    <p className="leading-relaxed">{ability.descriptionKo}</p>
                  </div>
                </div>
              )
            );
          })}
        </div>
      )}
    </div>
  );
}

export default AbilityGrid;
