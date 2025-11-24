import {detailedPokemInfoType} from "@/store/type";
import {useRouter} from "next/navigation";

function useHandleDropdownItemClick_searchPokemon() {
  const router = useRouter();

  const handleDropdownItemClick_searchPokemon = (pokemon: detailedPokemInfoType) => {
    console.log("Selected Pokemon:", pokemon);
    router.push(`/pokemons/${pokemon.pokemonId}`);
  };

  return handleDropdownItemClick_searchPokemon;
}

export default useHandleDropdownItemClick_searchPokemon;
