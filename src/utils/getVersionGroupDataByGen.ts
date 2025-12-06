import {koreanMoveType} from "@/logic/pokeapiLogics/type";

export const getVersionGroupDataByGen = (
  versionGroupDetails: koreanMoveType["versionGroupDetails"],
  genNumber?: number
) => {
  if (!versionGroupDetails || !genNumber) {
    return [];
  }

  // 선택된 세대로 필터링
  const filtered = versionGroupDetails.filter((detail) => {
    return detail.genNumber === genNumber;
  });

  // 각 versionName별로 egg 또는 level-up이 이미 나왔는지 추적
  const seenVersions = new Set<string>();

  return filtered.filter((detail) => {
    const {versionName, learnMethod} = detail;

    // egg 또는 level-up인 경우
    if (learnMethod === "egg" || learnMethod === "level-up") {
      // 이미 해당 versionName에서 egg 또는 level-up이 나왔다면 제외
      if (seenVersions.has(versionName)) {
        return false;
      }
      // 처음 나온 경우 기록
      seenVersions.add(versionName);
    }

    return true;
  });
};
