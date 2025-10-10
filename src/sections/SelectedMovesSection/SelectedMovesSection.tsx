import {useZustandStore} from "@/store/zustandStore";

interface SelectedMovesSectionProps {
  className?: string;
}

export const SelectedMovesSection = ({className = ""}: SelectedMovesSectionProps) => {
  const {selectedMovesArrayStates} = useZustandStore();
  return (
    <>
      <section className={`${className}`}>
        {selectedMovesArrayStates.map((move) => (
          <div key={move.id}>{move.koreanName}</div>
        ))}
      </section>
    </>
  );
};
