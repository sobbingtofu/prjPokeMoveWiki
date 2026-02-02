"use client";

import {useZustandStore} from "@/store/zustandStore";
import {useEffect} from "react";
import {koreanMoveType} from "@/logic/pokeapiLogics/type";
import KOREAN_MOVES_DATA from "@/store/KOREAN_MOVES.json";

export const useLoadData_KoreanMovesArr_v2 = () => {
  const setKoreanMovesArrayStates = useZustandStore((state) => state.setKoreanMovesArrayStates);

  // Zustand 상태 업데이트
  useEffect(() => {
    console.log("useLoadData_KoreanMovesArr_v2: ", KOREAN_MOVES_DATA);
    setKoreanMovesArrayStates(KOREAN_MOVES_DATA as koreanMoveType[]);
  }, [setKoreanMovesArrayStates]);
};
