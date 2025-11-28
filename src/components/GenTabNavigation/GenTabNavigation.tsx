import React from "react";

interface GenTabNavigationProps {
  selectedGen: number;
  handleGenClick: (gen: number) => void;
}

function GenTabNavigation({selectedGen, handleGenClick}: GenTabNavigationProps) {
  const GENERATION_TEXT = ["9", "8", "7", "6", "5", "4", "3", "2", "1"];
  return (
    <div className="flex flex-row  w-full flex-wrap">
      {GENERATION_TEXT.map((genText, index) => (
        <div
          key={index}
          className="flex flex-col cursor-pointer flex-1"
          onClick={() => handleGenClick(Number(genText))}
        >
          <h4
            className={`text-xs font-semibold text-center border-t border-gray-500 py-3 border-r border-l rounded-t-xl 
                ${selectedGen === Number(genText) ? "bg-white" : "bg-gray-700"}
                ${selectedGen === Number(genText) ? "text-black" : "text-gray-200"}`}
          >
            {genText}세대
          </h4>
        </div>
      ))}
    </div>
  );
}

export default GenTabNavigation;
