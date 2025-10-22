import {detailedPokemInfoType} from "@/store/type";
import {useZustandStore} from "@/store/zustandStore";

function useApplyFilters() {
  const {setDetailedLearningPokemons_Filtered, genFilter, learnMethodFilter} = useZustandStore();

  // 필터 적용 함수
  const applyFilters = (detailedLearningPokemons_PreFilter: detailedPokemInfoType[]) => {
    const filtered = detailedLearningPokemons_PreFilter.filter((pokemon) => {
      console.log("포켓몬 필터링 중:", pokemon.koreanName);
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

          console.log("체크 중인 기술:", moveDetail.moveKorName, "세대:", genKey, "학습 방법:", learnMethodKey);

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
          console.log("세대 선택됨:", isGenSelected, "학습 방법 선택됨:", isMethodSelected);

          // 세대와 학습 방법이 모두 선택되었으면 true
          return isGenSelected && isMethodSelected;
        });
      });

      return hasMatchingMove;
    });

    setDetailedLearningPokemons_Filtered(filtered);
    return filtered;
  };

  return applyFilters;
}

export default useApplyFilters;
