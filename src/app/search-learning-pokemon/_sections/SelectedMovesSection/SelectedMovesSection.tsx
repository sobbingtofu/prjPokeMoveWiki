'use client";';

import {MoveCard} from "@/components/MoveCard/MoveCard";
import ScrollContainer from "@/components/ScrollContainer/ScrollContainer";
import SelectedMovesDeleteButtons from "@/app/search-learning-pokemon/_components/SelectedMovesDeleteButtons/SelectedMovesDeleteButtons";
import useHandleMoveSearchBtnClick from "@/hooks/useHandleMoveSearchBtnClick";

import {useZustandStore} from "@/store/zustandStore";

interface SelectedMovesSectionProps {
  className?: string;
}

export const SelectedMovesSection = ({className = ""}: SelectedMovesSectionProps) => {
  const selectedMovesArrayStates = useZustandStore((state) => state.selectedMovesArrayStates);

  const handleMoveCardClick = (moveId: number) => {
    console.log("해당 기술 상세보기 넘어갈 예정:", moveId);
  };

  const handleSearchButtonClick = useHandleMoveSearchBtnClick();

  return (
    <section
      className={`w-full min-h-[400px] h-[calc(100vh-176px)] flex flex-col items-center bg-background-light px-6 sm:pb-6 pb-24`}
    >
      <div className="flex flex-col h-full justify-between w-full">
        <div className="sm:h-[calc(100%-110px)] h-[calc(100%-112px)] mt-8">
          <div className="flex items-baseline justify-between select-none">
            <div className="flex items-baseline ">
              <h2 className="text-xs font-bold text-slate-400">선택된 기술</h2>
              <p className="ml-2 inline-block text-xs text-slate-400 font-bold">{`(${selectedMovesArrayStates.length}개)`}</p>
            </div>
            <SelectedMovesDeleteButtons />
          </div>
          {selectedMovesArrayStates.length > 0 && (
            <ScrollContainer
              shouldAutoScrollOnLengthIncrease={true}
              itemsLength={selectedMovesArrayStates.length}
              className="grid grid-cols-1 content-start gap-x-8 gap-y-4 mt-4 
              auto-rows-max sm:h-[calc(100%-32px)] h-[calc(100%-32px)] w-[calc(100%+7px)] sm:w-[calc(100%+12px)] 
              sm:pr-[12px] pr-[7px]"
            >
              {selectedMovesArrayStates.map((move) => (
                <MoveCard key={move.id} move={move} onClick={() => handleMoveCardClick(move.id)} />
              ))}
            </ScrollContainer>
          )}
        </div>

        <button
          onClick={handleSearchButtonClick}
          className="w-full py-4 rounded-2xl bg-primary
        hover:bg-blue-600 shadow-blue-300/25 transition-colors duration-200 text-white font-black cursor-pointer"
        >
          <p className="text-[15px] font-bold">기술을 배우는 포켓몬 검색</p>
        </button>
      </div>
    </section>
  );
};
