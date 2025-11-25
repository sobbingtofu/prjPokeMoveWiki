import {koreanMoveType} from "@/logic/pokeapiLogics/type";
import TypeChip from "../TypeChip/TypeChip";
import {useEffect, useRef} from "react";

interface MoveSearchDropdownProps {
  move: koreanMoveType[];
  dropDownOnClick: (move: koreanMoveType) => void;
  smDropDownHeight: number;
  dropDownHeight: number;
  accentedMoveIndex: number;
  className?: string;
  dropDownRowSize?: "default" | "small";
}

function MoveSearchDropdown({
  move: filteredMoves,
  dropDownOnClick,
  smDropDownHeight,
  dropDownHeight,
  accentedMoveIndex,
  className,
  dropDownRowSize = "default",
}: MoveSearchDropdownProps) {
  const accentedItemRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (accentedItemRef.current) {
      if (accentedMoveIndex === 0 || accentedMoveIndex === filteredMoves.length - 1) {
        accentedItemRef.current.scrollIntoView({
          behavior: "instant",
          block: "nearest",
        });
      } else {
        accentedItemRef.current.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
        });
      }
    }
  }, [accentedMoveIndex]);

  return (
    <div
      onMouseDown={(e) => e.preventDefault()}
      className={`${className} absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg 
      overflow-y-auto z-50 scrollbar-thin `}
      style={{
        maxHeight: `${dropDownHeight}px`,
        ...(window.innerWidth < 640 && {maxHeight: `${smDropDownHeight}px`}),
      }}
    >
      {filteredMoves.map((move, index) => (
        <div
          key={move.id}
          ref={index === accentedMoveIndex ? accentedItemRef : null}
          onMouseDown={(e) => {
            e.preventDefault();
            dropDownOnClick(move);
          }}
          className={`px-4 cursor-pointer hover:bg-gray-100 border-b border-gray-100 last:border-b-0 transition-colors duration-150
            ${index === accentedMoveIndex ? "bg-cyan-100" : ""}
            ${dropDownRowSize === "small" ? "py-1.5 text-xs" : "py-3 text-sm"}
            `}
        >
          <div className="flex gap-2.5 justify-between items-center">
            <div className="flex-8 flex justify-start items-center ">
              <p className=" text-gray-900">{move.koreanName}</p>
            </div>

            <div className="w-1/12 flex justify-center items-center min-w-10">
              <p className="text-gray-500 font-bold ">
                {move.damageClass === "physical" ? "물리" : move.damageClass === "special" ? "특수" : "변화"}
              </p>
            </div>
            <TypeChip type={move.type} korType={move.korType} textSize={dropDownRowSize === "small" ? "2xs" : "sm"} />
          </div>
        </div>
      ))}
    </div>
  );
}

export default MoveSearchDropdown;
