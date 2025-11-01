import {MoveCard} from "@/app/search-learning-pokemon/_components/MoveCard/MoveCard";
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
      <section className={`${className} flex flex-col items-center  `}>
        <div className="flex flex-col sm:mt-[60px] mt-[30px] w-[90%] gap-3">
          <div className="flex w-full justify-center">
            <button
              onClick={handleSearchButtonClick}
              className="w-[80%] py-4 rounded-lg bg-gray-700 hover:bg-gray-900 text-white font-black cursor-pointer"
            >
              검색 실행
            </button>
          </div>
          <div className="flex items-baseline mt-3 justify-between select-none">
            <div className="flex items-baseline ">
              <h2 className="text-2xl font-bold ">선택된 기술</h2>
              <p className="ml-2 inline-block text-sm italic text-gray-700 font-bold">{`(${selectedMovesArrayStates.length}개)`}</p>
            </div>
            <SelectedMovesDeleteButtons />
          </div>
          {selectedMovesArrayStates.length > 0 && (
            <ScrollContainer
              shouldAutoScrollOnLengthIncrease={true}
              itemsLength={selectedMovesArrayStates.length}
              className="grid xl:grid-cols-2 grid-cols-1 content-start gap-x-8 gap-y-4
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
