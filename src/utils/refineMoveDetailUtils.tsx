import {moveDetailType} from "@/store/type";

interface LearnMethodDetail {
  methodName: string;
  learnedLevel: number;
}

// 포켓몬의 기술 상세 정보를 세대별로 고유한 정보만 남도록 다듬는 함수
export function refineMoveDetails(pokemonMoveDetails: moveDetailType[]) {
  const refinedMoveDetails = pokemonMoveDetails.map((move) => {
    const versionMap = new Map<number, LearnMethodDetail[]>();
    // genNumber를 키로, LearnMethodDetail 배열을 값으로 하는 Map

    move.versionDetails.forEach((versionDetail) => {
      if (versionDetail.genNumber) {
        const genNumber = versionDetail.genNumber;
        const learnMethodDetail: LearnMethodDetail = {
          methodName: versionDetail.learnMethod,
          learnedLevel: versionDetail.learnedLevel,
        };

        // 해당 genNumber가 이미 Map에 존재하는지 확인
        if (versionMap.has(genNumber)) {
          // 존재하면 learnMethod 배열에 추가
          const methods = versionMap.get(genNumber)!;
          // methodName이 중복되지 않으면 추가
          if (!methods.some((m) => m.methodName === learnMethodDetail.methodName)) {
            methods.push(learnMethodDetail);
          }
        } else {
          // 존재하지 않으면 새로운 learnMethod 배열 생성
          versionMap.set(genNumber, [learnMethodDetail]);
        }
      }
    });

    // Map을 배열로 변환
    const uniqueVersionDetails = Array.from(versionMap, ([genNumber, learnMethods]) => ({
      genNumber,
      learnMethod: learnMethods,
    }));

    return {
      moveKorName: move.moveKorName,
      uniqueVersionDetails,
    };
  });

  console.log("refinedMoveDetails 결과:", refinedMoveDetails);

  return refinedMoveDetails;
}
