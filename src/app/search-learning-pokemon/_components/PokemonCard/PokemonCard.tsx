import {detailedPokemInfoType} from "@/store/type";
import React, {useState} from "react";
import TypeChip from "../../../../components/TypeChip/TypeChip";
import {STAT_LABELS} from "@/store/constantStore";
import {useZustandStore} from "@/store/zustandStore";
import Image from "next/image";
import TypeChipContainer from "@/components/TypeChip/TypeChipContainer";
import StatGrid from "@/components/StatGrid/StatGrid";
import {refineMoveDetails} from "@/utils/refineMoveDetailUtils";
import Link from "next/link";

function PokemonCard({pokemon}: {pokemon: detailedPokemInfoType}) {
  const genFilter = useZustandStore((state) => state.genFilter);
  const learnMethodFilter = useZustandStore((state) => state.learnMethodFilter);

  const pokemonMainName =
    pokemon.koreanName.indexOf("(") > -1
      ? pokemon.koreanName.slice(0, pokemon.koreanName.indexOf("("))
      : pokemon.koreanName;
  const pokemonRegionSubname = pokemon.koreanName.includes("(")
    ? pokemon.koreanName.slice(pokemon.koreanName.indexOf("("))
    : "";

  const pokemonMoveDetails = pokemon.moveDetails || [];
  const refinedMoveDetails = refineMoveDetails(pokemonMoveDetails);

  const handleCardClick = (pokemon: detailedPokemInfoType) => {
    console.log("Clicked PokemonCard:", pokemon);
  };

  return (
    <Link href={`/pokemons/${pokemon.pokemonId}`} target="_blank" rel="noopener noreferrer" className="p-1">
      <div
        key={pokemon.name}
        onClick={() => handleCardClick(pokemon)}
        className="text-sm font-bold pt-4 pb-4 py-2 rounded-2xl flex flex-col justify-start items-start
        bg-gray-100  hover:scale-[1.02] hover:bg-gray-200 hover:shadow-lg transition-transform duration-200 ease-in-out cursor-pointer
        "
      >
        <div className="w-full flex flex-col justify-start items-start gap-5">
          {/* 이미지, 이름, 타입칩 */}
          <div className="w-full flex flex-col items-center gap-1">
            <div className="relative">
              <Image
                src={pokemon.spriteUrl}
                alt={pokemon.koreanName}
                className="fit"
                width={90}
                height={90}
                priority={false}
              />
            </div>

            <p className="text-lg">{pokemonMainName}</p>
            <p className="text-[8pt] h-[14px]">{pokemonRegionSubname}</p>
            <TypeChipContainer types={pokemon.types} koreantypes={pokemon.koreantypes} />
          </div>

          {/* 스탯 표시 */}
          <StatGrid pokemonStats={pokemon.stats} gridType="pokemonCard" />

          {/* 기술 별 배우는 세대 표시 */}
          <div className="w-full flex flex-col gap-1.5 px-4">
            {pokemon.moveDetails &&
              refinedMoveDetails.length > 0 &&
              refinedMoveDetails.map((moveItem) => (
                <div key={moveItem.moveKorName} className="mb-2 flex flex-col gap-0.5">
                  <p className="font-bold text-sm">{moveItem.moveKorName} </p>
                  <div className="flex flex-col ">
                    {moveItem.uniqueVersionDetails.map((versionDetail, idx) => {
                      const activatedGenNumber = Object.entries(genFilter).find(([key, value]) => value)?.[0];
                      const trimmedActivatedGenNumber = activatedGenNumber
                        ? parseInt(activatedGenNumber.replace("gen", ""))
                        : null;
                      return (
                        <div key={idx}>
                          {versionDetail.genNumber === trimmedActivatedGenNumber && (
                            <div className="flex gap-3.5">
                              <div className="flex gap-0 items-center">
                                {versionDetail.learnMethod.map((method, methodIdx) => {
                                  const methodNameMap: {[key: string]: string} = {
                                    "level-up": "레벨업",
                                    tutor: "기술가르침",
                                    machine: "기술머신",
                                    egg: "레벨업",
                                  };

                                  const activatedLearnMethods =
                                    Object.entries(learnMethodFilter)
                                      .filter(([key, value]) => value)
                                      .map((item) => {
                                        return item[0];
                                      }) || [];

                                  const korMethodName = methodNameMap[method.methodName] || method.methodName;
                                  return (
                                    <div key={methodIdx}>
                                      {activatedLearnMethods.includes(method.methodName) && (
                                        <div className="flex max-w-[70px] text-gray-600 text-xs">
                                          <p>
                                            {methodIdx > 0 && ", "} {korMethodName}
                                          </p>
                                          {korMethodName == "레벨업" && <p>({method.learnedLevel})</p>}
                                        </div>
                                      )}
                                    </div>
                                  );
                                })}
                                {/* <p className="text-gray-600  italic">({versionDetail.genNumber}세대)</p> */}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </Link>
  );
}

export default PokemonCard;
