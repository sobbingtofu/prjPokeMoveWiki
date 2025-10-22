import {detailedPokemInfoType} from "@/store/type";
import {useZustandStore} from "@/store/zustandStore";
import useApplySortings from "./useApplySortings";

function useApplyFilters() {
  const {detailedLearningPokemons_Filtered, setDetailedLearningPokemons_Filtered, genFilter, learnMethodFilter} =
    useZustandStore();

  const applySortings = useApplySortings();

  // 필터 적용 함수
  const applyFilters = (detailedLearningPokemons_Filtered: detailedPokemInfoType[]) => {
    console.log("Applying filters:", {genFilter, learnMethodFilter});
    console.log("Initial Pokemons:", detailedLearningPokemons_Filtered);
    const filtered = detailedLearningPokemons_Filtered.filter((pokemon) => {
      // 각 포켓몬의 moveDetails를 순회
      const hasMatchingMove = pokemon.moveDetails?.every((moveDetail) => {
        // 해당 기술의 versionDetails를 순회
        return moveDetail.versionDetails.some((versionDetail) => {
          // 선택된 세대인지 확인
          const genKey = `gen${versionDetail.genNumber}`;
          const isGenSelected = genFilter[genKey as keyof typeof genFilter];

          // 선택된 학습 방법인지 확인
          const learnMethodKey = versionDetail.learnMethod;
          let methodKey: keyof typeof learnMethodFilter;

          if (learnMethodKey === "level-up") {
            methodKey = "level-up";
          } else if (learnMethodKey === "tutor") {
            methodKey = "tutor";
          } else if (learnMethodKey === "machine") {
            methodKey = "machine";
          } else {
            return false;
          }

          const isMethodSelected = learnMethodFilter[methodKey];
          // 세대와 학습 방법이 모두 선택되었으면 true
          return isGenSelected && isMethodSelected;
        });
      });

      return hasMatchingMove;
    });
    console.log("Filtered Pokemons:", filtered);
    applySortings(filtered);
    return filtered;
  };

  return applyFilters;
}

export default useApplyFilters;
