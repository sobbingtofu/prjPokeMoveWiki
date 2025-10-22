import {detailedPokemInfoType} from "@/store/type";
import React from "react";
import TypeChip from "../TypeChip/TypeChip";
import {STAT_LABELS} from "@/store/constantStore";
import {useZustandStore} from "@/store/zustandStore";

interface LearnMethodDetail {
  methodName: string;
  learnedLevel: number;
}

function PokemonCard({pokemon}: {pokemon: detailedPokemInfoType}) {
  const {genFilter, learnMethodFilter} = useZustandStore();

  const pokemonMainName =
    pokemon.koreanName.indexOf("(") > -1
      ? pokemon.koreanName.slice(0, pokemon.koreanName.indexOf("("))
      : pokemon.koreanName;
  const pokemonRegionSubname = pokemon.koreanName.includes("(")
    ? pokemon.koreanName.slice(pokemon.koreanName.indexOf("("))
    : "";

  const pokemonMoveDetails = pokemon.moveDetails || [];
  const refinedMoveDetails = pokemonMoveDetails.map((move) => {
    const versionMap = new Map<number, LearnMethodDetail[]>();
    // genNumber를 키로, LearnMethodDetail 배열을 값으로 하는 Map

    move.versionDetails.forEach((versionDetail) => {
      if (versionDetail.genNumber) {
        const genNumber = versionDetail.genNumber;
        const learnMethodDetail: LearnMethodDetail = {
          methodName: versionDetail.learnMethod,
          learnedLevel: versionDetail.learnedLevel,
        };

        // 해당 genNumber가 이미 Map에 존재하는지 확인
        if (versionMap.has(genNumber)) {
          // 존재하면 learnMethod 배열에 추가
          const methods = versionMap.get(genNumber)!;
          // methodName이 중복되지 않으면 추가
          if (!methods.some((m) => m.methodName === learnMethodDetail.methodName)) {
            methods.push(learnMethodDetail);
          }
        } else {
          // 존재하지 않으면 새로운 learnMethod 배열 생성
          versionMap.set(genNumber, [learnMethodDetail]);
        }
      }
    });

    // Map을 배열로 변환
    const uniqueVersionDetails = Array.from(versionMap, ([genNumber, learnMethods]) => ({
      genNumber,
      learnMethod: learnMethods,
    }));

    return {
      moveKorName: move.moveKorName,
      uniqueVersionDetails,
    };
  });

  return (
    <div
      key={pokemon.name}
      className="text-sm font-bold px-4 py-2 bg-gray-100 rounded-2xl flex flex-col justify-start items-start gap-4"
    >
      {/* 이미지, 이름, 타입칩 */}
      <div className="w-full flex flex-col items-center gap-1">
        <div className="flex justify-center items-center w-[100px] h-[100px]">
          <img src={pokemon.spriteUrl} alt={pokemon.koreanName} />
        </div>
        <p className="text-lg">{pokemonMainName}</p>
        <p className="text-xs">{pokemonRegionSubname}</p>
        <div className="w-full flex flex-row justify-center gap-2 mt-1">
          {pokemon.types.map((type, index) => (
            <TypeChip key={type} type={type} korType={pokemon.koreantypes[index] || ""} textSize="xs" />
          ))}
        </div>
      </div>

      {/* 스탯 표시 */}
      <div className="text-[7pt] w-full">
        <div className="grid grid-cols-3 gap-y-2 w-full">
          {STAT_LABELS.map((stat) => {
            const statValue = pokemon.stats.find((s) => s.statName === stat.statName)?.statValue;
            return (
              <div key={stat.statName} className="flex flex-col items-center">
                <p className="text-center">{stat.label}</p>
                <p className="text-center">{statValue}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* 기술 별 배우는 세대 표시 */}
      <div className="w-full flex flex-col gap-1.5">
        {pokemon.moveDetails &&
          refinedMoveDetails.length > 0 &&
          refinedMoveDetails.map((moveItem) => (
            <div key={moveItem.moveKorName} className="mb-2 flex flex-col gap-0.5">
              <p className="font-bold text-xs">{moveItem.moveKorName} </p>
              <div className="flex flex-col ">
                {moveItem.uniqueVersionDetails.map((versionDetail, idx) => {
                  const activatedGenNumber = Object.entries(genFilter).find(([key, value]) => value)?.[0];
                  const trimmedActivatedGenNumber = activatedGenNumber
                    ? parseInt(activatedGenNumber.replace("gen", ""))
                    : null;
                  return (
                    <div key={idx}>
                      {versionDetail.genNumber === trimmedActivatedGenNumber && (
                        <div className="flex gap-3.5 text-[8pt]">
                          <div className="flex gap-1.5 items-center">
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
                                    <div className="flex max-w-[56px] text-gray-600">
                                      <p>{korMethodName}</p>
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
  );
}

export default PokemonCard;
