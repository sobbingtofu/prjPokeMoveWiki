import {useZustandStore} from "@/store/zustandStore";

function SelectedMovesDeleteButtons() {
  const {selectedMovesArrayStates, setSelectedMovesArrayStates} = useZustandStore();
  const handleClickDeleteButton = () => {
    confirm(
      `선택된 기술 ${
        selectedMovesArrayStates.filter((move) => move.isSelectedForDeletion).length
      }개를 목록에서 삭제하시겠습니까?`
    ) && setSelectedMovesArrayStates(selectedMovesArrayStates.filter((move) => !move.isSelectedForDeletion));
  };

  return (
    <>
      <div className="flex items-baseline gap-7">
        {selectedMovesArrayStates.filter((move) => move.isSelectedForDeletion).length > 0 && (
          <button className="ml-auto text-sm italic  cursor-pointer " onClick={handleClickDeleteButton}>
            <p className="text-red-500 font-bold hover:text-red-700 transition-colors duration-150">삭제</p>
          </button>
        )}
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
    </>
  );
}

export default SelectedMovesDeleteButtons;
