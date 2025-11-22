import {generateKoreanMoveData02} from "@/logic/pokeapiLogics/fetchMovePokemonLogics";
import {rawMoveDataFromPokmonDetailType} from "@/logic/pokeapiLogics/type";
import {generalPokemonTypes} from "@/utils/getTypeDefenseMatchup";

import {useQuery} from "@tanstack/react-query";
import React, {useEffect} from "react";

interface LearningMovesSectionProps {
  moves: rawMoveDataFromPokmonDetailType[];
  types: generalPokemonTypes[];
}

function LearningMovesSection({moves, types}: LearningMovesSectionProps) {
  const [selectedGen, setSelectedGen] = React.useState<number | null>(9);

  const {data: movesData, isLoading: isMovesLoading} = useQuery({
    queryKey: ["moves", moves],
    queryFn: () => generateKoreanMoveData02(moves!),
    staleTime: Infinity,
    gcTime: Infinity,
  });

  const generationText = ["9", "8", "7", "6", "5", "4", "3", "2", "1"];

  const handleGenClick = (gen: number) => {
    setSelectedGen(gen);
  };

  useEffect(() => {
    if (isMovesLoading) {
      console.log("LearningMovesSection - moves are loading...");
    } else {
      console.log("LearningMovesSection - movesData:", movesData);
    }
  }, [movesData, isMovesLoading]);

  return (
    <section className="w-full">
      <h3 className="font-bold text-lg mb-2">배우는 기술</h3>
      <div className="flex flex-row  w-full flex-wrap">
        {generationText.map((genText, index) => (
          <div
            key={index}
            className="flex flex-col cursor-pointer flex-1"
            onClick={() => handleGenClick(Number(genText))}
          >
            <h4
              className={`text-xs font-semibold text-center border-t-[1px] border-gray-500 py-2 border-r-[1px] border-l-[1px] rounded-t-xl 
                ${selectedGen === Number(genText) ? "bg-gray-200" : "bg-gray-700"}
                ${selectedGen === Number(genText) ? "text-black" : "text-gray-200"}`}
            >
              {genText}세대
            </h4>
          </div>
        ))}
      </div>
      <div className="w-full border-l-[1px] border-r-[1px] border-b-[1px] border-gray-500 min-h-2.5 bg-gray-200"></div>
    </section>
  );
}

export default LearningMovesSection;
