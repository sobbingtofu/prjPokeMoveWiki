import {pokemonTypeEnNames} from "@/logic/pokeapiLogics/type";
import {STAT_LABELS, STAT_LABELS_02} from "@/store/constantStore";
import {detailedPokemInfoType} from "@/store/type";
import React from "react";

interface StatGridProps {
  types?: pokemonTypeEnNames[];
  pokemonStats: detailedPokemInfoType["stats"];
  gridType: "pokemonCard" | "detailedSection";
}

function StatGrid({pokemonStats, gridType = "pokemonCard", types = []}: StatGridProps) {
  return (
    <div className={gridType === "pokemonCard" ? "text-[9pt] w-full mt-1" : "text-sm w-full mt-1"}>
      <div
        className={
          "grid  w-full font-bold" +
          (gridType === "pokemonCard" ? " grid-cols-3 gap-y-2" : " grid-cols-6 border border-gray-700")
        }
      >
        {STAT_LABELS_02.map((stat) => {
          const statValue = pokemonStats.find((s) => s.statName === stat.statName)?.statValue;

          if (gridType === "detailedSection") {
            return (
              <div key={stat.statName} className="flex flex-col border-r border-b border-gray-700 last:border-r-0">
                {/* 스탯 라벨 영역 */}
                <div className={`bg-${types[0]?.toLowerCase()} py-3 border-b border-gray-700`}>
                  <p className="text-center text-white">{stat.label}</p>
                </div>
                {/* 스탯 값 영역 */}
                <div className="bg-white py-3">
                  <p
                    className={`text-center font-bold ${
                      statValue && statValue >= 130 ? "text-red-600" : "text-gray-900"
                    }`}
                  >
                    {statValue}
                  </p>
                </div>
              </div>
            );
          }

          // pokemonCard 타입
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
      </div>
    </div>
  );
}

export default StatGrid;
