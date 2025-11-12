import {useZustandStore} from "@/store/zustandStore";
import Image from "next/image";
import React from "react";

interface DetailedPokemonSectionProps {
  pokemonId: string;
}

function DetailedPokemonSection({pokemonId}: DetailedPokemonSectionProps) {
  const detailedPokemons = useZustandStore((state) => state.detailedPokemons);

  const currentPokemon = detailedPokemons.find((p) => p.pokemonId == pokemonId);

  console.log(currentPokemon);
  return (
    <>
      <section className="w-dvw h-dvh overflow-hidden bg-gray-300 flex flex-col justify-start items-center">
        <div className="md:w-[60%] w-[80%] py-16 flex flex-col items-center gap-y-2 overflow-hidden ">
          {/* 이미지, 이름, 타입칩, 특성 영역 */}
          <div className="flex flex-row items-start gap-x-4 w-full bg-cyan-200">
            <Image
              className="border-2 border-gray-700 bg-gray-50"
              src={currentPokemon?.officialArtworkUrl || ""}
              alt={currentPokemon?.koreanName || "Pokemon"}
              width={200}
              height={200}
            />
            <div className="flex flex-row justify-center items-start gap-8">
              <h1 className="text-xl font-bold">{currentPokemon?.koreanName}</h1>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default DetailedPokemonSection;
