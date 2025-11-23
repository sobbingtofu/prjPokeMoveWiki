import {koreanMoveType} from "@/logic/pokeapiLogics/type";
import {METHOD_NAME_MAP, SERIES_NAME_MAP} from "@/store/constantStore";
import {useZustandStore} from "@/store/zustandStore";
import {getVersionGroupDataByGen} from "@/utils/getVersionGroupDataByGen";
import {PropsWithChildren} from "react";

interface MoveCardProps {
  type?: "searchLearningPokemon" | "pokemonDetail";
  move: koreanMoveType;
  key: number;
  genNumber?: number;
  onClick?: () => void;
}

export const MoveCard = ({
  move,
  type = "searchLearningPokemon",
  onClick,
  genNumber,
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

  const versionGroupDataOnSelectedGen = getVersionGroupDataByGen(move.versionGroupDetails, genNumber);

  return (
    <div
      onClick={onClick}
      className={`bg-${move.type.toLowerCase()}-shallow
      xl:min-w-[200px] select-none flex flex-row
      gap-2 rounded-lg bg-gray-100 shadow-md
      ${type === "searchLearningPokemon" ? "pr-4" : "sm:px-8 px-6"}
      `}
      {...props}
    >
      {/* 체크박스 */}
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

      {/* 내용물 */}
      <div className="flex flex-col flex-20 gap-y-2 py-3">
        <div
          className={`flex gap-y-2 
            ${type === "searchLearningPokemon" ? "flex-col" : "flex-row items-baseline w-full justify-between"}
            `}
        >
          <p
            className={`mt-0.5 font-bold
            ${type === "searchLearningPokemon" ? "text-sm" : "text-md"}
            `}
          >
            {move.koreanName}
          </p>
          <div
            className={`flex flex-row items-baseline justify-between
            ${type === "searchLearningPokemon" ? "" : "gap-x-10"}
            `}
          >
            <p className="text-xs font-bold ">
              {move.power ? `위력: ${move.power}` : "위력: --"} /{" "}
              {move.accuracy ? `명중: ${move.accuracy}` : "명중: --"}
            </p>
            <p className="text-xs font-bold italic">
              {move.korType} /{" "}
              {move.damageClass === "physical" ? "물리" : move.damageClass === "special" ? "특수" : "변화"}
            </p>
          </div>
        </div>

        {/* 기술 설명 */}
        <p
          className={`text-xs mb-1
          ${type === "searchLearningPokemon" ? "sm:block hidden" : ""}
          `}
        >
          {move.korDescription}
        </p>

        {/* 버전 별 습득 방법  */}
        {type === "pokemonDetail" && versionGroupDataOnSelectedGen && versionGroupDataOnSelectedGen.length > 0 && (
          <div className="text-xs sm:block hidden mb-1">
            {versionGroupDataOnSelectedGen?.map((detail, index) => {
              return (
                <div key={index} className="flex gap-x-2 font-bold">
                  <p className="w-[105px]">{SERIES_NAME_MAP[detail.versionName]}</p>
                  <p>{METHOD_NAME_MAP[detail.learnMethod]}</p>
                  <p>
                    {detail.learnMethod == "level-up"
                      ? `( Lv. ${detail.levelLearned} )`
                      : detail.learnMethod == "egg"
                      ? `( Lv. 0 )`
                      : ""}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
