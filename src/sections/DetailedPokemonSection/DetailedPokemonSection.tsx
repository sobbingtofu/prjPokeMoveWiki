import {useZustandStore} from "@/store/zustandStore";
import React from "react";

interface DetailedPokemonSectionProps {
  pokemonId: string;
}

function DetailedPokemonSection({pokemonId}: DetailedPokemonSectionProps) {
  const detailedPokemons = useZustandStore((state) => state.detailedPokemons);

  const currentPokemon02 = detailedPokemons.find((p) => p.pokemonId == pokemonId);

  console.log(currentPokemon02);
  return (
    <>
      <section className="w-dvw h-dvh overflow-hidden bg-gray-300 flex flex-col justify-center items-center">
        <div className="md:w-[60%] w-[80%] py-16 flex flex-col items-center gap-y-2 overflow-hidden ">
          {/* 이미지, 이름, 타입칩, 특성 영역 */}
          <div></div>
        </div>
      </section>
    </>
  );
}

export default DetailedPokemonSection;
