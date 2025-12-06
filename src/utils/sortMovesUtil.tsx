import {koreanMoveType} from "@/logic/pokeapiLogics/type";

// 기술을 정렬하는 함수
export function sortMovesByGeneration(moves: koreanMoveType[], selectedGen: number | null): koreanMoveType[] {
  if (!moves || moves.length === 0 || selectedGen === null) {
    return [];
  }

  // 각 move를 분류하고 정렬 기준 값을 계산하는 헬퍼 함수
  const getMoveCategory = (move: koreanMoveType) => {
    // 현재 selectedGen과 일치하는 versionGroupDetails 찾기
    const matchingDetails = move.versionGroupDetails?.filter((detail) => detail.genNumber === selectedGen) || [];

    // level-up 방식이 있는지 확인
    const hasLevelUp = matchingDetails.some(
      (detail) => detail.learnMethod === "level-up" || detail.learnMethod === "egg"
    );

    if (hasLevelUp) {
      // 그룹 A: level-up 있음
      // level-up인 마지막 요소의 levelLearned 찾기
      const levelUpDetails = matchingDetails.filter(
        (detail) => detail.learnMethod === "level-up" || detail.learnMethod === "egg"
      );
      const lastLevelUpDetail = levelUpDetails[levelUpDetails.length - 1];

      return {
        group: "A" as const,
        levelLearned: lastLevelUpDetail.levelLearned || 0,
        isMachine: false,
      };
    } else {
      // 그룹 B: level-up 없음
      // 마지막 요소가 machine인지 확인
      const lastMatchingDetail = matchingDetails[matchingDetails.length - 1];
      const isMachine = lastMatchingDetail.learnMethod === "machine";

      return {
        group: "B" as const,
        levelLearned: 9999, // 그룹 B에서는 사용하지 않음
        isMachine: isMachine,
      };
    }
  };

  // 정렬된 배열 생성
  return [...moves].sort((a, b) => {
    const categoryA = getMoveCategory(a);
    const categoryB = getMoveCategory(b);

    // 1. 그룹 비교: A가 B보다 먼저
    if (categoryA.group !== categoryB.group) {
      return categoryA.group === "A" ? -1 : 1;
    }

    // 2. 같은 그룹 내에서 정렬
    if (categoryA.group === "A") {
      // 그룹 A: levelLearned 오름차순
      return categoryA.levelLearned - categoryB.levelLearned;
    } else {
      // 그룹 B: machine이 먼저 (true가 false보다 먼저)
      if (categoryA.isMachine !== categoryB.isMachine) {
        return categoryA.isMachine ? -1 : 1;
      }
      // machine 여부가 같으면 원래 순서 유지
      return 0;
    }
  });
}
