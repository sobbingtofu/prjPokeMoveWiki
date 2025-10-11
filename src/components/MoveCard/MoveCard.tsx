import {koreanMoveType} from "@/logic/pokeapiLogics/type";
import {PropsWithChildren} from "react";

interface MoveCardProps {
  move: koreanMoveType;
  key: number;
  onClick?: () => void;
}

export const MoveCard = ({move, onClick, ...props}: PropsWithChildren<MoveCardProps>) => {
  return (
    <div
      onClick={onClick}
      className={`bg-${move.type.toLowerCase()}-shallow h-fit xl:min-w-[224px] mselect-none select-none cursor-pointer flex flex-col gap-1 px-4 py-2 rounded-lg bg-gray-100 shadow-md`}
      {...props}
    >
      <div className="flex flex-start items-baseline justify-between ">
        <p className="text-sm font-bold">{move.koreanName}</p>
      </div>
      <div className="flex flex-row items-baseline justify-between">
        <p className="text-xs font-bold italic">
          {move.korType} / {move.damageClass === "physical" ? "물리" : move.damageClass === "special" ? "특수" : "변화"}
        </p>
        <p className="text-xs font-bold ">
          {move.power ? `위력: ${move.power}` : "위력: --"} / {move.accuracy ? `명중: ${move.accuracy}` : "명중: --"}
        </p>
      </div>
      <p className="text-xs sm:block hidden mb-1">{move.korDescription}</p>
    </div>
  );
};
