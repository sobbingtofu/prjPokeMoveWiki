import {detailedPokemInfoType} from "@/store/type";
import React from "react";
import TypeChip from "../TypeChip/TypeChip";

interface LearnMethodDetail {
  methodName: string;
  learnedLevel: number;
}

function PokemonCard({pokemon}: {pokemon: detailedPokemInfoType}) {
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

      {/* 기술 별 배우는 세대 표시 */}
      <div>
        {pokemon.moveDetails &&
          refinedMoveDetails.length > 0 &&
          refinedMoveDetails.map((moveItem) => (
            <div key={moveItem.moveKorName} className="mb-2">
              <p className="font-bold">{moveItem.moveKorName}</p>
              <div className="flex flex-col">
                {moveItem.uniqueVersionDetails.map((versionDetail, idx) => (
                  <div key={idx} className="ml-2 flex gap-2">
                    <p>{versionDetail.genNumber}</p>
                    <div className="flex gap-1">
                      {versionDetail.learnMethod.map((method, methodIdx) => {
                        const methodNameMap: {[key: string]: string} = {
                          "level-up": "레벨업",
                          tutor: "기술가르침",
                          machine: "기술머신",
                          egg: "알",
                        };

                        const korMethodName = methodNameMap[method.methodName] || method.methodName;

                        return (
                          <div key={methodIdx} className="flex gap-1">
                            <p>{korMethodName}</p>
                            {method.learnedLevel > 0 && <p>Lv.{method.learnedLevel}</p>}
                          </div>
                        );
                      })}
                    </div>
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
