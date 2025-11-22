import {koreanMoveType} from "@/logic/pokeapiLogics/type";
import {useZustandStore} from "@/store/zustandStore";
import {PropsWithChildren} from "react";

interface MoveCardProps {
  type?: "searchLearningPokemon" | "pokemonDetail";
  move: koreanMoveType;
  key: number;
  onClick?: () => void;
}

export const MoveCard = ({
  move,
  type = "searchLearningPokemon",
  onClick,
  ...props
}: PropsWithChildren<MoveCardProps>) => {
  const selectedMovesArrayStates = useZustandStore((state) => state.selectedMovesArrayStates);
  const setSelectedMovesArrayStates = useZustandStore((state) => state.setSelectedMovesArrayStates);

  const handleCheckboxChange = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
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
      xl:min-w-[200px] select-none flex flex-row
      gap-2 rounded-lg bg-gray-100 shadow-md
      ${type === "searchLearningPokemon" ? "pr-4" : "px-8"}
      `}
      {...props}
    >
      {type === "searchLearningPokemon" && (
        <div className="flex-1 flex justify-center items-start">
          <div
            className="h-full rounded-l-lg bg-gray-300 w-min px-3 flex justify-center items-center cursor-pointer"
            onClick={(e) => handleCheckboxChange(e)}
          >
            <div
              className={`w-5 h-5 border-2 border-white rounded-full flex items-center justify-center transition-colors ${
                selectedMovesArrayStates.find((selectedMove) => selectedMove.id === move.id)?.isSelectedForDeletion
                  ? "bg-white"
                  : "bg-transparent"
              }`}
            >
              {selectedMovesArrayStates.find((selectedMove) => selectedMove.id === move.id)?.isSelectedForDeletion && (
                <svg className="w-4 h-4 text-gray-800" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col flex-20 gap-y-2 py-3">
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
