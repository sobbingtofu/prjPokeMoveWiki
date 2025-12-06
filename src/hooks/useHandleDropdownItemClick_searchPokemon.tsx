import {detailedPokemInfoType} from "@/store/type";
import {usePathname, useRouter} from "next/navigation";

function useHandleDropdownItemClick_searchPokemon() {
  const router = useRouter();
  const pathname = usePathname();

  const handleDropdownItemClick_searchPokemon = (pokemon: detailedPokemInfoType) => {
    console.log("Selected Pokemon:", pokemon);
    const targetPath = `/pokemons/${pokemon.pokemonId}`;

    if (pathname === targetPath) {
      router.refresh();
    } else {
      router.push(targetPath);
    }
  };

  return handleDropdownItemClick_searchPokemon;
}

export default useHandleDropdownItemClick_searchPokemon;
