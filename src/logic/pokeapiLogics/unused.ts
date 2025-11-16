// 기술을 배우는 포켓몬 객체 배열에 기술 학습 방법 및 세대 정보 추가

import axios from "axios";
import {koreanMoveType, versionGroupDetailType} from "./type";

// 리소스 부족으로 못돌림
export const addLearningMethodsAndGens = async (koreanMovesArray: koreanMoveType[]) => {
  try {
    // 각 기술별로 처리
    const updatedMovesPromises = koreanMovesArray.map(async (move) => {
      const currentMoveLearningPokemonArr = move.learningPokemonEn;

      // 각 포켓몬별로 version_group_details 추가
      const updatedPokemonsPromises = currentMoveLearningPokemonArr.map(async (pokemonInfo) => {
        const {data: currentPokemonDetailData} = await axios.get(pokemonInfo.url);

        // 현재 포켓몬의 moves 배열에서 현재 기술을 찾기
        const moveData = currentPokemonDetailData.moves.find(
          (moveItem: {move: {name: string; url: string}; version_group_details: any[]}) =>
            moveItem.move.name === move.name
        );

        // version_group_details 추출 및 변환
        const version_group_details: versionGroupDetailType[] = moveData
          ? moveData.version_group_details.map(
              (detail: {
                level_learned_at: number;
                move_learn_method: {name: string; url: string};
                version_group: {name: string; url: string};
              }) => ({
                versionName: detail.version_group.name,
                levelLearned: detail.level_learned_at,
                learnMethod: detail.move_learn_method.name,
              })
            )
          : [];

        return {
          ...pokemonInfo,
          version_group_details,
        };
      });

      const updatedPokemons = await Promise.all(updatedPokemonsPromises);

      // 기술 객체 업데이트
      return {
        ...move,
        learningPokemonEn: updatedPokemons,
      };
    });

    const updatedMoves = await Promise.all(updatedMovesPromises);

    return updatedMoves;
  } catch (error) {
    console.error("기술 학습 방법 및 세대 정보 호출 실패:", error);
    return [];
  }
};
