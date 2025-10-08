import {initialMovesType, koreanMoveType} from "@/logic/pokeapiLogics/type";
import axios from "axios";

export const getInitialMoveData = async () => {
  try {
    const {data: rawData} = await axios.get("https://pokeapi.co/api/v2/move?offset=0&limit=1000");
    if (Array.isArray(rawData.results)) {
      const rawMoveArray: Omit<initialMovesType, "id">[] = rawData.results;
      const initialMovesArr: initialMovesType[] = rawMoveArray.map((item, index) => {
        return {
          id: index + 1,
          name: item.name,
          url: item.url,
        };
      });
      return initialMovesArr;
    } else {
      throw new Error(`Invalid data format: ${typeof rawData.results}`);
    }
  } catch (error) {
    console.error("기술 초기 정보 호출 실패:", error);
  }
};

export const generateKoreanMoveData = async (initialMovesArr: initialMovesType[]) => {
  // map과 Promise.all 패턴 - 비동기 작업 병렬 처리 표준 방법
  try {
    // 1. map을 사용하여 Promise의 배열인 promises 생성
    const promises = initialMovesArr.map(async (initialMoveItem) => {
      const {data} = await axios.get(initialMoveItem.url);
      // 2. promises 배열의 각 요소는 아래 형태의 객체를 최종적으로 반환하는 promise임
      return {
        id: initialMoveItem.id,
        name: initialMoveItem.name,
        koreanName:
          data.names.find(
            (nameItem: {language: {name: string; url: string}; name: string}) => nameItem.language.name === "ko"
          )?.name || initialMoveItem.name,
        type: data.type.name,
        learningPokemonEn: data.learned_by_pokemon,
        damageClass: data.damage_class.name,
      };
    });

    // 3. Promise.all을 기법 -  promises 배열의 각 promise가 해결(resolved)되면,
    // 그 결과값들로 이루어진 배열이 반환됨
    const koreanMoveNameArr = await Promise.all(promises);

    // 4. 모든 데이터가 채워진 완전한 배열을 반환함
    return koreanMoveNameArr;
  } catch (error) {
    console.error("기술 국문 정보 호출 실패:", error);
    return [];
  }
};
