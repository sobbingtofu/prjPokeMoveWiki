import {detailedPokemInfoType} from "@/store/type";
import {useZustandStore} from "@/store/zustandStore";

function useApplySortings() {
  const {sortOption, setDetailedLearningPokemons_Filtered} = useZustandStore();

  const applySortings = (detailedLearningPokemons_PreSorted: detailedPokemInfoType[]) => {
    console.log("applySortings 호출됨");
    const activatedSortOptions = Object.entries(sortOption).filter(([, value]) => value !== false)[0];

    const sortAscDesc = "asc"; // 추후 변경
    if (activatedSortOptions[0] === "alphabetical") {
      if (sortAscDesc === "asc") {
        const sorted = [...detailedLearningPokemons_PreSorted].sort((a, b) => a.koreanName.localeCompare(b.koreanName));
        setDetailedLearningPokemons_Filtered(sorted);
        return sorted;
      } else if (sortAscDesc === "desc") {
        const sorted = [...detailedLearningPokemons_PreSorted].sort((a, b) => b.koreanName.localeCompare(a.koreanName));
        setDetailedLearningPokemons_Filtered(sorted);
        return sorted;
      }
    } else {
      const sortOptionStatName = activatedSortOptions[0];
      console.log("정렬할 스탯 이름:", sortOptionStatName);
      if (sortAscDesc === "asc") {
        const sorted = [...detailedLearningPokemons_PreSorted].sort((a, b) => {
          const aStat = a.stats.find((stat) => stat.statName === sortOptionStatName)?.statValue || 0;
          const bStat = b.stats.find((stat) => stat.statName === sortOptionStatName)?.statValue || 0;
          return aStat - bStat;
        });
        setDetailedLearningPokemons_Filtered(sorted);
        return sorted;
      } else if (sortAscDesc === "desc") {
        const sorted = [...detailedLearningPokemons_PreSorted].sort((a, b) => {
          const aStat = a.stats.find((stat) => stat.statName === sortOptionStatName)?.statValue || 0;
          const bStat = b.stats.find((stat) => stat.statName === sortOptionStatName)?.statValue || 0;
          return bStat - aStat;
        });
        setDetailedLearningPokemons_Filtered(sorted);
        return sorted;
      }
    }
  };

  return applySortings;
}

export default useApplySortings;
