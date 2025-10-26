import {koreanMoveType} from "@/logic/pokeapiLogics/type";
import TypeChip from "../../../../components/TypeChip/TypeChip";
import {useEffect, useRef} from "react";
import {detailedPokemInfoType} from "@/store/type";

function PokemonSearchDropdown({pokemons}: {pokemons: detailedPokemInfoType[]}) {
  return (
    <div
      onMouseDown={(e) => e.preventDefault()}
      className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg  overflow-y-auto z-50 scrollbar-thin h-[100px] w-full"
      // style={{
      //   maxHeight: `${dropDownHeight}px`,
      //   ...(window.innerWidth < 640 && {maxHeight: `${smDropDownHeight}px`}),
      // }}
    >
      {pokemons.map((pokemon, index) => (
        <div
          key={pokemon.pokemonId}
          className={`px-4 py-3 cursor-pointer hover:bg-gray-100 border-b border-gray-100 last:border-b-0 transition-colors duration-150 `}
        >
          <div className="flex gap-2.5 justify-between items-center">
            <div className="flex-8 flex justify-start items-center ">
              <p className=" text-gray-900 text-sm">{pokemon.koreanName}</p>
            </div>

            <div className="w-1/12 flex justify-center items-center min-w-[40px]">
              <p className="text-gray-500 text-sm font-bold ">
                {pokemon.evStats?.map((evStat) => `${evStat.statName} +${evStat.statValue}`).join(", ")}
              </p>
            </div>
            {pokemon.types.map((type) => (
              <TypeChip key={type} type={type} korType={type} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default PokemonSearchDropdown;
