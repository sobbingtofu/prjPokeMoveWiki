import {koreanMoveType} from "@/logic/pokeapiLogics/type";
import {useZustandStore} from "@/store/zustandStore";
import {PropsWithChildren} from "react";

interface MoveCardProps {
  move: koreanMoveType;
  key: number;
  onClick?: () => void;
}

export const MoveCard = ({move, onClick, ...props}: PropsWithChildren<MoveCardProps>) => {
  const {selectedMovesArrayStates, setSelectedMovesArrayStates} = useZustandStore();

  const handleCheckboxChange = () => {
    setSelectedMovesArrayStates((prev) =>
      prev.map((selectedMove) =>
        selectedMove.id === move.id
          ? {...selectedMove, isSelectedForDeletion: !selectedMove.isSelectedForDeletion}
          : selectedMove
      )
    );
  };
  return (
    <div
      onClick={onClick}
      className={`bg-${move.type.toLowerCase()}-shallow
      xl:min-w-[200px] select-none cursor-pointer flex flex-row
      gap-2 px-4 py-3 rounded-lg bg-gray-100 shadow-md`}
      {...props}
    >
      <div className="flex-1 flex justify-center items-start">
        <input
          type="checkbox"
          className="mt-1 w-5 h-5 accent-blue-500 border-blue-950"
          checked={
            selectedMovesArrayStates.find((selectedMove) => selectedMove.id === move.id)?.isSelectedForDeletion || false
          }
          onChange={handleCheckboxChange}
          onClick={(e) => e.stopPropagation()} // 부모의 onClick 이벤트 전파를 막습니다.
        />{" "}
      </div>
      <div className="flex flex-col flex-20 gap-y-2">
        <p className="mt-0.5 text-sm font-bold">{move.koreanName}</p>
        <div className="flex flex-row  items-baseline justify-between">
          <p className="text-xs font-bold ">
            {move.power ? `위력: ${move.power}` : "위력: --"} / {move.accuracy ? `명중: ${move.accuracy}` : "명중: --"}
          </p>
          <p className="text-xs font-bold italic">
            {move.korType} /{" "}
            {move.damageClass === "physical" ? "물리" : move.damageClass === "special" ? "특수" : "변화"}
          </p>
        </div>
        <p className="text-xs sm:block hidden mb-1">{move.korDescription}</p>
      </div>
    </div>
  );
};
