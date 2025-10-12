import {MoveCard} from "@/components/MoveCard/MoveCard";
import {useZustandStore} from "@/store/zustandStore";
import {useEffect, useRef, useState} from "react";

interface SelectedMovesSectionProps {
  className?: string;
}

export const SelectedMovesSection = ({className = ""}: SelectedMovesSectionProps) => {
  const {selectedMovesArrayStates, setSelectedMovesArrayStates} = useZustandStore();

  const [isScrolledToBottom, setIsScrolledToBottom] = useState(false);
  // 맨 아래 스크롤 여부 확인용 상태

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const prevLengthRef = useRef(selectedMovesArrayStates.length);
  // 배열 길이 변경 시 비교 통한 추가/삭제인지 파악용 이전 배열 길이 저장 ref

  const handleMoveCardClick = (moveId: number) => {
    console.log("해당 기술 상세보기 넘어갈 예정:", moveId);
  };

  const handleClickDeleteButton = () => {
    confirm(
      `선택된 기술 ${
        selectedMovesArrayStates.filter((move) => move.isSelectedForDeletion).length
      }개를 목록에서 삭제하시겠습니까?`
    ) && setSelectedMovesArrayStates(selectedMovesArrayStates.filter((move) => !move.isSelectedForDeletion));
  };

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const {scrollTop, scrollHeight, clientHeight} = scrollContainerRef.current;
      // 스크롤이 맨 아래에 도달했는지 확인 (여유값 5px 추가)
      const isAtBottom = scrollTop + clientHeight >= scrollHeight - 5;
      setIsScrolledToBottom(isAtBottom);
    }
  };

  // 배열 길이가 증가했을 때만 (새로운 기술이 추가되었을 때만) 스크롤 동작
  useEffect(() => {
    const currentLength = selectedMovesArrayStates.length;
    const prevLength = prevLengthRef.current;

    if (currentLength > prevLength && scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: scrollContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }

    // 길이 다음 비교를 위해 저장
    prevLengthRef.current = currentLength;
  }, [selectedMovesArrayStates.length]);

  useEffect(() => {
    handleScroll();
  }, [selectedMovesArrayStates]);

  return (
    <>
      <section className={`${className} flex flex-col items-center  `}>
        <div className="flex flex-col sm:mt-[60px] mt-[30px] w-[80%] gap-3">
          <div className="flex w-full justify-center">
            <button className="w-[80%] py-4 rounded-lg bg-gray-700 hover:bg-gray-900 text-white font-black cursor-pointer">
              배우는 포켓몬 보기
            </button>
          </div>
          <div className="flex items-baseline mt-3 justify-between select-none">
            <div className="flex items-baseline ">
              <h2 className="text-2xl font-bold ">선택된 기술</h2>
              <p className="ml-2 inline-block text-sm italic text-gray-700 font-bold">{`(${selectedMovesArrayStates.length}개)`}</p>
            </div>
            <div className="flex items-baseline gap-7">
              <button className="ml-auto text-sm italic  cursor-pointer " onClick={handleClickDeleteButton}>
                {selectedMovesArrayStates.filter((move) => move.isSelectedForDeletion).length > 0 && (
                  <p className="text-red-500 font-bold hover:text-red-700 transition-colors duration-150">삭제</p>
                )}
              </button>
              <button
                className="ml-auto  font-bold cursor-pointer "
                onClick={() => {
                  if (selectedMovesArrayStates.some((move) => !move.isSelectedForDeletion)) {
                    setSelectedMovesArrayStates((prev) =>
                      prev.map((move) => ({
                        ...move,
                        isSelectedForDeletion: true,
                      }))
                    );
                  } else {
                    setSelectedMovesArrayStates((prev) =>
                      prev.map((move) => ({
                        ...move,
                        isSelectedForDeletion: false,
                      }))
                    );
                  }
                }}
              >
                <p className="text-sm italic text-gray-700 hover:text-gray-500">
                  {selectedMovesArrayStates.some((move) => !move.isSelectedForDeletion)
                    ? "전체 선택"
                    : selectedMovesArrayStates.length > 0
                    ? "전체 해제"
                    : ""}
                </p>
              </button>
            </div>
          </div>
          <div className="relative">
            <div
              ref={scrollContainerRef}
              onScroll={handleScroll}
              className="grid lg:grid-cols-2 grid-cols-1 content-start gap-x-8 gap-y-4 mb-5
            xl:min-w-[360px] min-w-[220px] py-4 sm:h-[70dvh] h-[36dvh]
            overflow-y-scroll overflow-x-hidden no-scrollbar"
            >
              {selectedMovesArrayStates.map((move) => (
                <MoveCard key={move.id} move={move} onClick={() => handleMoveCardClick(move.id)} />
              ))}
            </div>
            {!isScrolledToBottom && (
              <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent pointer-events-none" />
            )}
          </div>
        </div>
      </section>
    </>
  );
};
