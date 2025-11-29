import {
  addLearningMethodsAndGensToPokemons,
  generateDetailedPokemon,
} from "@/logic/pokeapiLogics/fetchMovePokemonLogics";
import {useZustandStore} from "@/store/zustandStore";
import useApplyFilters from "./useApplyFilters";
import useApplySortings from "./useApplySortings";
import {useState} from "react";
import {selectedMoveType} from "@/store/type";

function useGenerateSingleMoveLearningPokemons() {
  const setDetailedLearningPokemons_PreFilter = useZustandStore((state) => state.setDetailedLearningPokemons_PreFilter);

  const applyFilters = useApplyFilters();
  const applySortings = useApplySortings();

  const [isGenerating, setIsGenerating] = useState<boolean>(true);

  const generateSingleMoveLearningPokemons = async (move: selectedMoveType | null) => {
    if (move !== null) {
      console.log("initial Pokemons:", move.learningPokemonEn);

      const learningPokemons = await generateDetailedPokemon(move.learningPokemonEn || []);

      console.log("detailed learningPokemons:", learningPokemons);

      if (!learningPokemons) throw new Error("learningPokemons Error");

      const learningPokemonsWithMoveDetails = await addLearningMethodsAndGensToPokemons(learningPokemons, [move]);
      console.log("learningPokemonsWithMoveDetails:", learningPokemonsWithMoveDetails);

      if (!learningPokemonsWithMoveDetails) throw new Error("learningPokemonsWithMoveDetails Error");

      setDetailedLearningPokemons_PreFilter(learningPokemonsWithMoveDetails);

      const filtered = applyFilters(learningPokemonsWithMoveDetails);
      const sorted = applySortings(filtered);
      console.log("최종 정렬된 포켓몬들:", sorted);
      // setIsLearningPokemonBottomSheetOpen(true);
    }

    setIsGenerating(false);
  };

  return {generateSingleMoveLearningPokemons, isGenerating};
}

export default useGenerateSingleMoveLearningPokemons;
