import {detailedPokemInfoType} from "@/store/type";
import React, {useState} from "react";
import TypeChip from "../../../../components/TypeChip/TypeChip";
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

  const [isChecked, setIsChecked] = useState(false);

  return (
    <div
      key={pokemon.name}
      className="text-sm font-bold pt-4 pb-4 py-2 bg-gray-100 rounded-2xl flex flex-col justify-start items-start"
    >
      {/* 담아보기 기능 영역 */}
      {/* <div
        className={`flex justify-center items-center w-full cursor-pointer h-[36px]
        ${isChecked ? "bg-gray-400 hover:bg-gray-500 " : "bg-cyan-300"} rounded-t-2xl relative`}
        onClick={() => setIsChecked(!isChecked)}
      >
        <div
          className={`w-5 h-5 border-2 border-white rounded-full flex items-center justify-center transition-colors ${
            isChecked ? "bg-white" : "bg-transparent"
          }`}
        >
          {isChecked && (
            <svg className="w-4 h-4 text-gray-800" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </div>
      </div> */}

      <div className="w-full bg-gray-100 flex flex-col justify-start items-start gap-5">
        {/* 이미지, 이름, 타입칩 */}
        <div className="w-full flex flex-col items-center gap-1">
          <div className="flex justify-center items-center w-[100px] h-[100px]">
            <img src={pokemon.spriteUrl} alt={pokemon.koreanName} />
          </div>
          <p className="text-lg">{pokemonMainName}</p>
          <p className="text-[8pt] h-[14px]">{pokemonRegionSubname}</p>
          <div className="w-full flex flex-row justify-center gap-2 mt-1">
            {pokemon.types.map((type, index) => (
              <TypeChip key={type} type={type} korType={pokemon.koreantypes[index] || ""} textSize="xs" />
            ))}
          </div>
        </div>

        {/* 스탯 표시 */}
        <div className="text-[9pt] w-full mt-1">
          <div className="grid grid-cols-3 gap-y-2 w-full">
            {STAT_LABELS.map((stat) => {
              const statValue = pokemon.stats.find((s) => s.statName === stat.statName)?.statValue;
              return (
                <div key={stat.statName} className="flex flex-col items-center">
                  <p className={`text-center ${statValue && statValue >= 130 ? "text-red-600" : "text-black"}`}>
                    {stat.label}
                  </p>
                  <p className={`text-center ${statValue && statValue >= 130 ? "text-red-600" : "text-black"}`}>
                    {statValue}
                  </p>
                </div>
              );
            })}
            {/* 테스트 영역 */}
            {/* <p>
            {(pokemon.stats.find((s) => s.statName === "hp")?.statValue || 0) +
              (pokemon.stats.find((s) => s.statName === "defense")?.statValue || 0)}
          </p>
          <p>
            {(pokemon.stats.find((s) => s.statName === "hp")?.statValue || 0) +
              (pokemon.stats.find((s) => s.statName === "defense")?.statValue || 0) +
              (pokemon.stats.find((s) => s.statName === "specialDefense")?.statValue || 0)}
          </p> */}
          </div>
        </div>

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
  );
}

export default PokemonCard;
