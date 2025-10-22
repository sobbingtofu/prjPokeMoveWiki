import {addLearningMethodsAndGensToPokemons, getLearningPokemonsDetail} from "@/logic/pokeapiLogics/pokeapiLogics";
import {useZustandStore} from "@/store/zustandStore";
import useApplyFilters from "./useApplyFilters";

function useHandleSearchBtnClick() {
  const {
    detailedLearningPokemons_PreFilter,
    selectedMovesArrayStates,
    setLastSearchMovesArrayStates,
    setPokemonsLearningAllLastSearchMoves,
    setLoadingStates,
    setDetailedLearningPokemons_PreFilter,
    genFilter,
    learnMethodFilter,
  } = useZustandStore();

  const applyFilters = useApplyFilters();

  const handleSearchButtonClick = async () => {
    // console.log(selectedMovesArrayStates);
    setLoadingStates({isMovesLearningPokemonSearchLoading: true});

    setLastSearchMovesArrayStates(selectedMovesArrayStates);

    if (selectedMovesArrayStates.length === 0) {
      setPokemonsLearningAllLastSearchMoves([]);
      setDetailedLearningPokemons_PreFilter([]);
    } else {
      const firstMoveLearners = selectedMovesArrayStates[0].learningPokemonEn;

      const commonPokemons = firstMoveLearners.filter((pokemon) => {
        // 첫 번째 기술을 배우는 포켓몬이 나머지 모든 기술도 배우는지 확인
        return selectedMovesArrayStates
          .slice(1)
          .every((move) =>
            move.learningPokemonEn.some((learner) => learner.name === pokemon.name && learner.url === pokemon.url)
          );
      });

      setPokemonsLearningAllLastSearchMoves(commonPokemons);

      const learningPokemons = await getLearningPokemonsDetail(commonPokemons);

      if (!learningPokemons) throw new Error("learningPokemons Error");

      const learningPokemonsWithMoveDetails = await addLearningMethodsAndGensToPokemons(
        learningPokemons,
        selectedMovesArrayStates
      );

      if (!learningPokemonsWithMoveDetails) throw new Error("learningPokemonsWithMoveDetails Error");

      setDetailedLearningPokemons_PreFilter(learningPokemonsWithMoveDetails);

      applyFilters(learningPokemonsWithMoveDetails);
    }

    setLoadingStates({isMovesLearningPokemonSearchLoading: false});
  };

  return handleSearchButtonClick;
}

export default useHandleSearchBtnClick;
