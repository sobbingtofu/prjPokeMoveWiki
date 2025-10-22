import {detailedPokemInfoType} from "@/store/type";
import {useZustandStore} from "@/store/zustandStore";

function useApplySortings() {
  const singleSortingValues = ["hp", "attack", "defense", "specialAttack", "specialDefense", "speed"];

  const {sortOption, setDetailedLearningPokemons_Filtered, sortAscDescOption} = useZustandStore();

  const applySortings = (detailedLearningPokemons_PreSorted: detailedPokemInfoType[]) => {
    const activatedSortOption = Object.entries(sortOption).filter(([, value]) => value !== false)[0][0];

    const sortAscDesc = Object.entries(sortAscDescOption).find(([, value]) => value !== false)?.[0];
    if (activatedSortOption === "alphabetical") {
      if (sortAscDesc === "asc") {
        const sorted = [...detailedLearningPokemons_PreSorted].sort((a, b) => a.koreanName.localeCompare(b.koreanName));
        setDetailedLearningPokemons_Filtered(sorted);
        return sorted;
      } else if (sortAscDesc === "desc") {
        const sorted = [...detailedLearningPokemons_PreSorted].sort((a, b) => b.koreanName.localeCompare(a.koreanName));
        setDetailedLearningPokemons_Filtered(sorted);
        return sorted;
      }
    } else if (singleSortingValues.includes(activatedSortOption)) {
      if (sortAscDesc === "asc") {
        const sorted = [...detailedLearningPokemons_PreSorted].sort((a, b) => {
          const aStat = a.stats.find((stat) => stat.statName === activatedSortOption)?.statValue || 0;
          const bStat = b.stats.find((stat) => stat.statName === activatedSortOption)?.statValue || 0;
          return aStat - bStat;
        });
        setDetailedLearningPokemons_Filtered(sorted);
        return sorted;
      } else if (sortAscDesc === "desc") {
        const sorted = [...detailedLearningPokemons_PreSorted].sort((a, b) => {
          const aStat = a.stats.find((stat) => stat.statName === activatedSortOption)?.statValue || 0;
          const bStat = b.stats.find((stat) => stat.statName === activatedSortOption)?.statValue || 0;
          return bStat - aStat;
        });
        setDetailedLearningPokemons_Filtered(sorted);
        // console.log("sorted", sorted);
        return sorted;
      }
    } else {
      const sortOption01 = activatedSortOption.split("_")[0];
      const sortOption02 = activatedSortOption.split("_")[1];
      const sortOption03 = activatedSortOption.split("_")[2];

      // console.log("sortOption01", sortOption01);
      // console.log("sortOption02", sortOption02);
      // console.log("sortOption03", sortOption03);

      const sorted = [...detailedLearningPokemons_PreSorted].sort((a, b) => {
        const aStat01 = a.stats.find((stat) => stat.statName === sortOption01)?.statValue || 0;
        const bStat01 = b.stats.find((stat) => stat.statName === sortOption01)?.statValue || 0;
        const aStat02 = a.stats.find((stat) => stat.statName === sortOption02)?.statValue || 0;
        const bStat02 = b.stats.find((stat) => stat.statName === sortOption02)?.statValue || 0;
        const aStat03 = a.stats.find((stat) => stat.statName === sortOption03)?.statValue || 0;
        const bStat03 = b.stats.find((stat) => stat.statName === sortOption03)?.statValue || 0;

        const sortResult =
          sortAscDesc === "asc"
            ? aStat01 + aStat02 + aStat03 - (bStat01 + bStat02 + bStat03)
            : bStat01 + bStat02 + bStat03 - (aStat01 + aStat02 + aStat03);

        return sortResult;
      });

      setDetailedLearningPokemons_Filtered(sorted);
      console.log("sorted", sorted);
      return sorted;
    }
  };

  return applySortings;
}

export default useApplySortings;
