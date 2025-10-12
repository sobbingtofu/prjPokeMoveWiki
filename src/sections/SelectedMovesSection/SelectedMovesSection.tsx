import {MoveCard} from "@/components/MoveCard/MoveCard";
import {useZustandStore} from "@/store/zustandStore";

interface SelectedMovesSectionProps {
  className?: string;
}

export const SelectedMovesSection = ({className = ""}: SelectedMovesSectionProps) => {
  const {selectedMovesArrayStates, setSelectedMovesArrayStates} = useZustandStore();

  const handleMoveCardClick = (moveId: number) => {
    setSelectedMovesArrayStates(selectedMovesArrayStates.filter((move) => move.id !== moveId));
  };

  return (
    <>
      <section className={`${className} flex flex-col items-center  `}>
        <div className="flex flex-col sm:mt-[60px] mt-[30px] w-[80%] gap-3">
          <div className="w-full bg-gray-700 rounded-md  hover:bg-gray-500 transition-colors">
            <button className="w-full py-4 text-white font-black  cursor-pointer">배우는 포켓몬 보기</button>
          </div>
          <div className="flex items-baseline mt-3">
            <h2 className="text-2xl font-bold ">선택된 기술들</h2>
            <p className="ml-2 inline-block text-sm italic text-gray-700 font-bold">{`(${selectedMovesArrayStates.length})개`}</p>
            <div
              className="ml-auto text-sm italic text-gray-700 font-bold cursor-pointer hover:text-gray-500"
              onClick={() => {
                confirm("정말 모두 지우시겠습니까?") && setSelectedMovesArrayStates([]);
              }}
            >
              <p>모두 지우기</p>
            </div>
          </div>

          <div className="grid content-start xl:grid-cols-2 grid-cols-1 gap-x-8 gap-y-4 xl:min-w-[360px] min-w-[220px] p-4 sm:h-[70dvh] h-[25dvh] overflow-y-scroll overflow-x-hidden">
            {selectedMovesArrayStates.map((move) => (
              <MoveCard key={move.id} move={move} onClick={() => handleMoveCardClick(move.id)} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
};
