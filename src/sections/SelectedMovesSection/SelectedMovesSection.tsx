import {MoveCard} from "@/components/MoveCard/MoveCard";
import {useZustandStore} from "@/store/zustandStore";

interface SelectedMovesSectionProps {
  className?: string;
}

export const SelectedMovesSection = ({className = ""}: SelectedMovesSectionProps) => {
  const {selectedMovesArrayStates} = useZustandStore();
  return (
    <>
      <section className={`${className} flex flex-col items-center`}>
        <div className="flex flex-col mt-[140px] min-w-[360px] w-[80%]">
          <h2 className="text-2xl font-bold mb-4">현재 선택된 기술들</h2>
          <div className="grid grid-cols-2 gap-x-8 gap-y-4">
            {selectedMovesArrayStates.map((move) => (
              <MoveCard key={move.id} move={move} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
};
