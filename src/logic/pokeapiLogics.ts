import {initialMovesType, koreanMoveType} from "@/app/types/initialMovesType";
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
  try {
    const koreanMoveNameArr: koreanMoveType[] = [];
    initialMovesArr.forEach(async (initialMoveItem) => {
      const {data} = await axios.get(initialMoveItem.url);
      koreanMoveNameArr.push({
        id: initialMoveItem.id,
        name: initialMoveItem.name,
        koreanName:
          data.names.find(
            (nameItem: {language: {name: string; url: string}; name: string}) => nameItem.language.name === "ko"
          )?.name || "",
        type: data.type.name,
      });
    });
    return koreanMoveNameArr;
  } catch (error) {
    console.error("기술 국문  정보 호출 실패:", error);
  }
};

export const getKoreanMoveData = async () => {
  const initialMoves = await getInitialMoveData();
  if (!initialMoves) return;

  const koreanMoves = await generateKoreanMoveData(initialMoves);
  if (!koreanMoves) return;
  return koreanMoves;
};
