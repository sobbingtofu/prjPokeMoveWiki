import {MoveCard} from "@/components/MoveCard/MoveCard";
import {generateKoreanMoveData02} from "@/logic/pokeapiLogics/fetchMovePokemonLogics";
import {koreanMoveType, rawMoveDataFromPokmonDetailType} from "@/logic/pokeapiLogics/type";
import {generalPokemonTypes} from "@/utils/getTypeDefenseMatchup";
import {sortMovesByGeneration} from "@/utils/sortMovesUtil";

import {useQuery} from "@tanstack/react-query";
import React, {useEffect, useMemo} from "react";

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

  const filteredMovesByGen = (
    movesData
      ? movesData.filter((move) => {
          return (
            move &&
            move.versionGroupDetails &&
            move.versionGroupDetails.some((detail) => {
              return detail.genNumber == selectedGen;
            })
          );
        })
      : []
  ) as koreanMoveType[];

  const sortedFinalMoves: koreanMoveType[] = useMemo(() => {
    return sortMovesByGeneration(filteredMovesByGen, selectedGen);
  }, [filteredMovesByGen, selectedGen]);

  useEffect(() => {
    if (isMovesLoading) {
      console.log("LearningMovesSection - moves are loading...");
    } else {
      console.log("sortedFinalMoves:", sortedFinalMoves);
    }
  }, [movesData, isMovesLoading, selectedGen]);

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
              className={`text-xs font-semibold text-center border-t border-gray-500 py-3 border-r border-l rounded-t-xl 
                ${selectedGen === Number(genText) ? "bg-white" : "bg-gray-700"}
                ${selectedGen === Number(genText) ? "text-black" : "text-gray-200"}`}
            >
              {genText}세대
            </h4>
          </div>
        ))}
      </div>
      <div
        className="w-full border-l border-r border-b border-gray-500 min-h-2.5 bg-white
      flex flex-col gap-y-2 px-4 py-3 rounded-b-lg"
      >
        {sortedFinalMoves.length > 0 ? (
          sortedFinalMoves.map((move) => {
            return move ? <MoveCard move={move} key={move.id} type="pokemonDetail" /> : null;
          })
        ) : (
          <p className="text-sm text-gray-500">배우는 기술 정보가 존재하지 않습니다.</p>
        )}
      </div>
    </section>
  );
}

export default LearningMovesSection;
