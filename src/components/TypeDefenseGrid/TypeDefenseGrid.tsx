import {generalPokemonTypes, getPokemonDefenseMatchup} from "@/utils/getTypeDefenseMatchup";
import React from "react";
import TypeChip from "../TypeChip/TypeChip";

interface TypeDefenseGridProps {
  types: generalPokemonTypes[];
}

function TypeDefenseGrid({types}: TypeDefenseGridProps) {
  const defenseMatchup = getPokemonDefenseMatchup(types);

  console.log("defenseMatchup in TypeDefenseGrid:", defenseMatchup);

  // 배수 순서 정의해 고정
  const multiplierOrder = ["200", "100", "50", "25", "0"];

  // 각 배수별 타입 개수를 기반으로 칼럼 너비 계산
  const getColumnWidth = (typeCount: number) => {
    if (typeCount === 0) return "flex-1";
    if (typeCount === 1) return "flex-2";
    if (typeCount === 2) return "flex-3";
    if (typeCount <= 4) return "flex-3";
    return "flex-5";
  };

  return (
    <div className="w-full bg-gray-900 text-white">
      {/* Header */}
      <div className={`bg-${types[0].toLowerCase()} px-4 py-2 text-sm w-full font-bold flex justify-center`}>
        {"방어 상성 (특성 미적용)"}
      </div>

      {/* Content */}
      {defenseMatchup && (
        <div className="flex flex-row w-full justify-center">
          {multiplierOrder.map((multiplier) => {
            const typeList = defenseMatchup[multiplier as keyof typeof defenseMatchup] || [];
            const columnWidth = getColumnWidth(typeList.length);
            return (
              <div key={multiplier} className={`flex flex-col ${columnWidth} border-r border-gray-500 last:border-r-0`}>
                <div className="flex justify-center items-center w-full py-2 text-sm border-b border-gray-700 font-medium">
                  {parseInt(multiplier) / 100 + "배"}
                </div>
                <div className="flex flex-wrap justify-center items-center gap-1.5 p-2 min-h-[60px]">
                  {typeList.length > 0 ? (
                    typeList.map((type) => (
                      <div key={type} className="flex justify-center items-center">
                        <TypeChip type={type} textSize="2xs" />
                      </div>
                    ))
                  ) : (
                    <div className="text-gray-600 text-xs">-</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default TypeDefenseGrid;
