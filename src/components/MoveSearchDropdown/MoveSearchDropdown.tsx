import {koreanMoveType} from "@/logic/pokeapiLogics/type";

function MoveSearchDropdown({
  move: filteredMoves,
  dropDownOnClick,
  smDropDownHeight,
  dropDownHeight,
}: {
  move: koreanMoveType[];
  dropDownOnClick: (move: koreanMoveType) => void;
  smDropDownHeight: number;
  dropDownHeight: number;
}) {
  return (
    <div
      onMouseDown={(e) => e.preventDefault()}
      className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg  overflow-y-auto z-50"
      style={{
        maxHeight: `${dropDownHeight}px`,
        ...(window.innerWidth < 640 && {maxHeight: `${smDropDownHeight}px`}),
      }}
    >
      {filteredMoves.map((move) => (
        <div
          key={move.id}
          onMouseDown={(e) => {
            e.preventDefault();
            dropDownOnClick(move);
          }}
          className="px-4 py-3 cursor-pointer hover:bg-gray-100 border-b border-gray-100 last:border-b-0 transition-colors duration-150"
        >
          <div className="flex gap-2.5 justify-between items-center">
            <div className="flex-8 flex justify-start items-center ">
              <p className=" text-gray-900 text-sm">{move.koreanName}</p>
            </div>

            <div className="w-1/12 flex justify-center items-center min-w-[40px]">
              <p className="text-gray-500 text-sm font-bold ">
                {move.damageClass === "physical" ? "물리" : move.damageClass === "special" ? "특수" : "변화"}
              </p>
            </div>
            <div className="w-1/12 flex justify-center items-center min-w-[65px]">
              <p
                className={`rounded-full font-bold w-[65px] text-sm text-center text-white bg-${move.type.toLowerCase()} px-2.5 py-1.5`}
              >
                {move.korType}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default MoveSearchDropdown;
