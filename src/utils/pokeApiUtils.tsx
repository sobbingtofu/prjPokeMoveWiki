import {VERSION_GROUP_TO_GEN} from "@/store/constantStore";

// 버전 그룹명으로 세대 번호 조회
export const getGenNumberByVersionGroup = (versionGroupName: string): number => {
  const genInfo = VERSION_GROUP_TO_GEN.find((gen) => gen.versionGroups.includes(versionGroupName));
  return genInfo?.genNumber || 0;
};

// url에서 맨 마지막 id 숫자 부분 추출
export const extractNumberBySplitting = (url: string): string | null => {
  // 1. URL 끝에 '/'가 있으면 제거 (균일한 처리를 위해)
  const cleanURL = url.endsWith("/") ? url.slice(0, -1) : url;

  // 2. '/' 구분자로 문자열을 분할하여 배열을 만듭니다.
  const segments = cleanURL.split("/");

  // 3. 배열의 마지막 요소(숫자)를 가져옵니다.
  const lastSegment = segments[segments.length - 1];

  // 4. 마지막 요소가 숫자로만 구성되어 있는지 확인합니다 (선택적).
  if (lastSegment && /^\d+$/.test(lastSegment)) {
    return lastSegment;
  }

  return null;
};
