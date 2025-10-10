import {koreanMoveType} from "@/logic/pokeapiLogics/type";
import {PropsWithChildren} from "react";

interface MoveCardProps {
  move: koreanMoveType;
  key: number;
}

export const MoveCard = ({children, move, ...props}: PropsWithChildren<MoveCardProps>) => {
  return (
    <div
      className={`bg-${move.type.toLowerCase()}-shallow flex flex-col gap-1 px-4 py-2 rounded-lg bg-gray-100 shadow-md`}
      {...props}
    >
      <p className="text-sm font-bold">{move.koreanName}</p>
      <div className="flex flex-row items-baseline justify-between">
        <p className="text-xs font-bold italic">
          {move.korType} / {move.damageClass === "physical" ? "물리" : move.damageClass === "special" ? "특수" : "변화"}
        </p>
        <p className="text-xs font-bold ">
          {move.power ? `위력: ${move.power}` : "위력: --"} / {move.accuracy ? `명중: ${move.accuracy}` : "명중: --"}
        </p>
      </div>
      <p className="text-xs">{move.korDescription}</p>
    </div>
  );
};
