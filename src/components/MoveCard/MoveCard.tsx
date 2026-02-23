import {koreanMoveType} from "@/logic/pokeapiLogics/type";
import {METHOD_NAME_MAP, SERIES_NAME_MAP} from "@/store/constantStore";
import {useZustandStore} from "@/store/zustandStore";
import {getVersionGroupDataByGen} from "@/utils/getVersionGroupDataByGen";
import {PropsWithChildren} from "react";
import TypeChip from "../TypeChip/TypeChip";

interface MoveCardProps {
  type?: "searchLearningPokemon" | "pokemonDetail";
  move: koreanMoveType;
  key: number;
  genNumber?: number;
  onClick?: () => void;
  style?: string;
}

export const MoveCard = ({
  move,
  type = "searchLearningPokemon",
  onClick,
  genNumber,
  style,
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
          : selectedMove,
      ),
    );
  };

  const versionGroupDataOnSelectedGen = getVersionGroupDataByGen(move.versionGroupDetails, genNumber);

  return (
    <div
      onClick={onClick}
      className={`
        ${style} bg-card-background
        w-full sm:w-[334px] min-h-[132px] max-h-[140px] select-none flex flex-row border border-gray-700
        gap-2 rounded-xl bg-gray-100 shadow-md
        ${type === "searchLearningPokemon" ? "pr-5 pl-5" : "sm:pl-8 pl-6 sm:pr-5 pr-4"}`}
      {...props}
    >
      {/* 내용물 */}
      <div className="flex flex-col pt-[14px] pb-[16px] w-full h-full justify-between">
        <div>
          {/* 타입침, 이름, 체크 동그라미 */}
          <div className="flex justify-between items-center">
            <div className="flex justify-start items-center">
              <TypeChip type={move.type} textSize="minimum" />
              <p
                className={`mt-0.5 font-medium text-slate-100 ml-2
                ${type === "searchLearningPokemon" ? "text-base" : "text-base"}
              `}
              >
                {move.koreanName}
              </p>
            </div>

            {/* 체크박스 */}
            {type === "searchLearningPokemon" && (
              <div
                onClick={(e) => handleCheckboxChange(e)}
                className={`w-4 h-4 border-[1.5px] border-gray-200 rounded-full flex items-center justify-center transition-colors ${
                  selectedMovesArrayStates.find((selectedMove) => selectedMove.id === move.id)?.isSelectedForDeletion
                    ? "bg-white"
                    : "bg-transparent"
                }`}
              >
                {selectedMovesArrayStates.find((selectedMove) => selectedMove.id === move.id)
                  ?.isSelectedForDeletion && (
                  <svg className="w-4 h-4 text-gray-800" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </div>
            )}
          </div>

          {/* 기술 설명 */}
          <p
            className={`text-xs text-slate-300 leading-tight overflow-hidden mt-3 font-light
            ${type === "searchLearningPokemon" ? "sm:block hidden" : ""}
            `}
            style={{
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {move.korDescription}
          </p>
        </div>

        <div
          className={`flex 2xl:flex-row xl:items-baseline xl:justify-between xl:flex-col xl:items-start
            gap-y-2 flex-row items-baseline justify-between text-slate-400 mt-2
            ${type === "searchLearningPokemon" ? "" : "gap-x-10 sm:w-auto w-full sm:justify-end justify-between"}
            `}
        >
          {/* 위력, 명중 */}
          <div
            className={`text-xs font-bold flex gap-2
              ${type === "searchLearningPokemon" ? "" : "w-[115px] justify-end"}
              `}
          >
            <p className="w-[53px]">{move.power ? `위력: ${move.power}` : "위력: --"}</p>
            <p className="w-[53px]">{move.accuracy ? `명중: ${move.accuracy}` : "명중: --"}</p>
          </div>
          {/* 타입, 유형 */}
          <div
            className={`text-xs font-light flex  items-center 
                ${type === "searchLearningPokemon" ? "w-auto gap-2" : "w-full gap-3"}
                ${type === "searchLearningPokemon" ? "" : "w-[78px] justify-end"}
              `}
          >
            <p>분류: {move.damageClass === "physical" ? "물리" : move.damageClass === "special" ? "특수" : "변화"}</p>
            {type === "pokemonDetail" && <TypeChip type={move.type} textSize="2xs" />}
          </div>
        </div>

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
