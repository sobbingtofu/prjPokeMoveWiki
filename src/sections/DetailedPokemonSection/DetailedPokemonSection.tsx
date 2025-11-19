import AbilityGrid from "@/components/AbilityGrid/AbilityGrid";
import StatGrid from "@/components/StatGrid/StatGrid";
import TypeChipContainer from "@/components/TypeChip/TypeChipContainer";
import {detailedPokemInfoType} from "@/store/type";
import {useZustandStore} from "@/store/zustandStore";
import {getPokemonDefenseMatchup} from "@/utils/getTypeDefenseMatchup";
import Image from "next/image";
import React, {useEffect} from "react";

interface DetailedPokemonSectionProps {
  currentPokemon: detailedPokemInfoType;
}

function DetailedPokemonSection({currentPokemon}: DetailedPokemonSectionProps) {
  console.log("DetailedPokemonSection 렌더링:", currentPokemon);

  useEffect(() => {
    const typeDefenseMatchup = getPokemonDefenseMatchup(currentPokemon.types);
    console.log("typeDefenseMatchup:", typeDefenseMatchup);
  }, [currentPokemon]);

  return (
    <>
      {currentPokemon && (
        <section
          className="w-dvw h-[calc(100dvh-7dvh)] bg-gray-300 flex flex-col justify-start items-center
            overflow-y-auto scrollbar-thin scrollbar-track-gray-300 scrollbar-thumb-gray-500 no-scrollbar-buttons"
        >
          <div
            className="max-w-[1050px] sm:w-[60%] w-[80%] sm:min-w-[700px] min-w-[300px]
                py-16 flex flex-col items-center sm:gap-y-2 gap-y-6"
          >
            {/* 이미지, 이름, 타입칩, 특성 영역 */}
            <div className="w-full flex flex-col gap-y-8">
              <div className="flex sm:flex-row flex-col sm:items-start items-center gap-x-6 w-full sm:gap-y-0 gap-y-4">
                {/* 이미지 */}
                <Image
                  className="border-2 border-gray-700 bg-gray-50"
                  src={currentPokemon.officialArtworkUrl || ""}
                  alt={currentPokemon.koreanName || "Pokemon"}
                  width={200}
                  height={200}
                />

                <div className="flex flex-col h-full w-full justify-between sm:gap-y-0 gap-y-4">
                  {/* 이름 및 타입칩 - 최상단 */}
                  <div className="flex flex-col justify-start sm:items-start items-center gap-2 w-full">
                    <h1 className="text-3xl font-bold">{currentPokemon?.koreanName}</h1>
                    <div>
                      <TypeChipContainer
                        types={currentPokemon?.types || []}
                        koreantypes={currentPokemon?.koreantypes || []}
                        justifyContent="end"
                      />
                    </div>
                  </div>
                  <StatGrid
                    pokemonStats={currentPokemon?.stats || []}
                    gridType="detailedSection"
                    types={currentPokemon?.types || []}
                  />
                </div>
              </div>
              {/* 특성 표 - 최하단 */}
              <AbilityGrid types={currentPokemon?.types || []} abilities={currentPokemon?.abilities || []} />

              {/* 상성표 */}

              {/* 배우는 기술 */}
            </div>
          </div>
        </section>
      )}
    </>
  );
}

export default DetailedPokemonSection;
