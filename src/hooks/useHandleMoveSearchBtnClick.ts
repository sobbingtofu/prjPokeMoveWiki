import {
  addLearningMethodsAndGensToPokemons,
  generateDetailedPokemon,
} from "@/logic/pokeapiLogics/fetchMovePokemonLogics";
import {useZustandStore} from "@/store/zustandStore";
import useApplyFilters from "./useApplyFilters";
import useApplySortings from "./useApplySortings";

function useHandleMoveSearchBtnClick() {
  const selectedMovesArrayStates = useZustandStore((state) => state.selectedMovesArrayStates);
  const setLastSearchMovesArrayStates = useZustandStore((state) => state.setLastSearchMovesArrayStates);
  const setPokemonsLearningAllLastSearchMoves = useZustandStore((state) => state.setPokemonsLearningAllLastSearchMoves);
  const setLoadingStates = useZustandStore((state) => state.setLoadingStates);
  const setDetailedLearningPokemons_PreFilter = useZustandStore((state) => state.setDetailedLearningPokemons_PreFilter);
  const setIsLearningPokemonBottomSheetOpen = useZustandStore((state) => state.setIsLearningPokemonBottomSheetOpen);

  const applyFilters = useApplyFilters();
  const applySortings = useApplySortings();

  const handleSearchButtonClick = async () => {
    // console.log(selectedMovesArrayStates);
    setLoadingStates({isMovesLearningPokemonSearchLoading: true});

    setLastSearchMovesArrayStates(selectedMovesArrayStates);

    if (selectedMovesArrayStates.length === 0) {
      setPokemonsLearningAllLastSearchMoves([]);
      setDetailedLearningPokemons_PreFilter([]);
    } else {
      const firstMoveLearners = selectedMovesArrayStates[0].learningPokemonEn || [];

      const commonPokemons = firstMoveLearners.filter((pokemon) => {
        // 첫 번째 기술을 배우는 포켓몬이 나머지 모든 기술도 배우는지 확인
        return selectedMovesArrayStates
          .slice(1)
          .every((move) =>
            move.learningPokemonEn?.some((learner) => learner.name === pokemon.name && learner.url === pokemon.url)
          );
      });

      setPokemonsLearningAllLastSearchMoves(commonPokemons);

      const learningPokemons = await generateDetailedPokemon(commonPokemons);

      if (!learningPokemons) throw new Error("learningPokemons Error");

      const learningPokemonsWithMoveDetails = await addLearningMethodsAndGensToPokemons(
        learningPokemons,
        selectedMovesArrayStates
      );

      if (!learningPokemonsWithMoveDetails) throw new Error("learningPokemonsWithMoveDetails Error");

      setDetailedLearningPokemons_PreFilter(learningPokemonsWithMoveDetails);

      const filtered = applyFilters(learningPokemonsWithMoveDetails);
      const sorted = applySortings(filtered);
      console.log("최종 정렬된 포켓몬들:", sorted);
      setIsLearningPokemonBottomSheetOpen(true);
    }

    setLoadingStates({isMovesLearningPokemonSearchLoading: false});
  };

  return handleSearchButtonClick;
}

export default useHandleMoveSearchBtnClick;
