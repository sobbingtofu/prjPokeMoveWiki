import {MoveCard} from "@/components/MoveCard/MoveCard";
import {useZustandStore} from "@/store/zustandStore";

interface SelectedMovesSectionProps {
  className?: string;
}

export const SelectedMovesSection = ({className = ""}: SelectedMovesSectionProps) => {
  const {selectedMovesArrayStates, setSelectedMovesArrayStates} = useZustandStore();

  const handleMoveCardClick = (moveId: number) => {
    console.log("해당 기술 상세보기 넘어갈 예정:", moveId);
    // setSelectedMovesArrayStates(selectedMovesArrayStates.filter((move) => move.id !== moveId));
  };

  const handleClickDeleteButton = () => {
    confirm(
      `선택된 기술 ${
        selectedMovesArrayStates.filter((move) => move.isSelectedForDeletion).length
      }개를 목록에서 삭제하시겠습니까?`
    ) && setSelectedMovesArrayStates(selectedMovesArrayStates.filter((move) => !move.isSelectedForDeletion));
  };

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

          <div
            className="flex flex-col content-start gap-x-8 gap-y-4
            xl:min-w-[360px] min-w-[220px] py-4 sm:h-[70dvh] h-[25dvh]
            overflow-y-scroll overflow-x-hidden"
          >
            {selectedMovesArrayStates.map((move) => (
              <MoveCard key={move.id} move={move} onClick={() => handleMoveCardClick(move.id)} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
};
