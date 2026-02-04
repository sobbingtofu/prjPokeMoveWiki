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
    <>
      <section className={`${className} flex flex-col items-center bg-background-light px-6`}>
        <div className="flex flex-col sm:mt-[16px] mt-[30px] w-full">
          <div className="flex w-full justify-center">
            <button
              onClick={handleSearchButtonClick}
              className="w-full py-4 rounded-2xl font-extrabold bg-primary hover:bg-blue-600 shadow-blue-300/25 transition-colors duration-200 text-white font-black cursor-pointer"
            >
              검색 실행
            </button>
          </div>
          <div className="flex items-baseline mt-8 justify-between select-none">
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
              xl:min-w-[360px] min-w-[220px] sm:h-[43dvh] h-[43dvh] no-scrollbar auto-rows-max "
            >
              {selectedMovesArrayStates.map((move) => (
                <MoveCard key={move.id} move={move} onClick={() => handleMoveCardClick(move.id)} />
              ))}
            </ScrollContainer>
          )}
        </div>
      </section>
    </>
  );
};
