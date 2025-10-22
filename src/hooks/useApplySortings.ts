import {detailedPokemInfoType} from "@/store/type";
import {useZustandStore} from "@/store/zustandStore";

function useApplySortings() {
  const {sortOption, setDetailedLearningPokemons_Filtered} = useZustandStore();

  const applySortings = (detailedLearningPokemons_PreSorted: detailedPokemInfoType[]) => {
    const activatedSortOptions = Object.entries(sortOption).filter(([, value]) => value !== "deactivated")[0];

    if (activatedSortOptions[0] === "alphabetical") {
      if (activatedSortOptions[1] === "asc") {
        const sorted = [...detailedLearningPokemons_PreSorted].sort((a, b) => a.koreanName.localeCompare(b.koreanName));
        setDetailedLearningPokemons_Filtered(sorted);
        return sorted;
      } else if (activatedSortOptions[1] === "desc") {
        const sorted = [...detailedLearningPokemons_PreSorted].sort((a, b) => b.koreanName.localeCompare(a.koreanName));
        setDetailedLearningPokemons_Filtered(sorted);
        return sorted;
      }
    }
  };

  return applySortings;
}

export default useApplySortings;
