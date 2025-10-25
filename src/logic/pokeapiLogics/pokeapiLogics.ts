import {
  initialMovesType,
  koreanMoveType,
  pokemonBasicInfoType,
  versionGroupDetailType,
} from "@/logic/pokeapiLogics/type";
import {
  MOVE_SUPPLEMENTARY_INFO,
  REGION_NAME_EN_TO_KO,
  TYPE_NAME_EN_TO_KO,
  VERSION_GROUP_TO_GEN,
} from "@/store/constantStore";
import {detailedPokemInfoType, moveDetailType, selectedMoveType} from "@/store/type";
import axios from "axios";

// 01. 기술 raw data 배열 가져오기
export const getInitialMoveData = async () => {
  const {data: rawData} = await axios.get("https://pokeapi.co/api/v2/move?offset=0&limit=1000");
  if (!Array.isArray(rawData.results)) {
    throw new Error(`Invalid data format: ${typeof rawData.results}`);
  }

  const initialMovesArr: initialMovesType[] = rawData.results.map((item: any, index: number) => ({
    id: index + 1,
    name: item.name,
    url: item.url,
  }));

  return initialMovesArr;
};

// 02. 기술 국문명 추가 및 어떻게든 배우는 포켓몬 (영어이름 + url) 객체 배열 가져와
// learningPokemonEn 속성에 추가 > 얘를 03에서 활용
export const generateKoreanMoveData = async (initialMovesArr: initialMovesType[]) => {
  const promises = initialMovesArr.map(async (initialMoveItem) => {
    try {
      const {data} = await axios.get(initialMoveItem.url, {timeout: 10000});

      return {
        id: initialMoveItem.id,
        name: initialMoveItem.name,
        koreanName:
          data.names.find((nameItem: any) => nameItem.language.name === "ko")?.name ||
          MOVE_SUPPLEMENTARY_INFO.find((move) => move.name === initialMoveItem.name)?.addedKorName ||
          initialMoveItem.name,
        type: data.type.name,
        korType: TYPE_NAME_EN_TO_KO.find((type) => type.typeName === data.type.name)?.korTypeName || data.type.name,
        learningPokemonEn: data.learned_by_pokemon,
        damageClass: data.damage_class.name,
        url: initialMoveItem.url,
        korDescription: (
          data.flavor_text_entries.findLast((entry: any) => entry.language.name === "ko")?.flavor_text ||
          data.flavor_text_entries.findLast((entry: any) => entry.language.name === "en")?.flavor_text ||
          ""
        )
          .replace(/\n/g, " ")
          .replace(/\s+/g, " ")
          .trim(),
        hasKoreanDescription: !!data.flavor_text_entries.findLast((entry: any) => entry.language.name === "ko"),
        power: data.power,
        accuracy: data.accuracy,
        pp: data.pp,
        priority: data.priority,
        effectChance: data.effect_chance,
        target: data.target.name,
      };
    } catch (itemError) {
      console.error(`기술 ${initialMoveItem.name} 데이터 조회 실패:`, itemError);
      return null;
    }
  });

  const koreanMoveNameArr = await Promise.all(promises);
  const validMoves = koreanMoveNameArr.filter((move): move is koreanMoveType => move !== null);

  return validMoves.filter((move) => move.type !== "shadow" && !move.korDescription.includes("사용할 수 없는 기술"));
};

// 02-1. 기술을 배우는 포켓몬 객체 배열에 기술 학습 방법 및 세대 정보 추가
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

// 03. 포켓몬의 상세정보 추가
export const getLearningPokemonsDetail = async (commonPokemons: pokemonBasicInfoType[]) => {
  const promises = commonPokemons.map(async (pokemonInfo) => {
    const {data: basicData} = await axios.get(pokemonInfo.url);
    const speciesUrl = basicData.species.url;

    const additionalFormTextRaw = pokemonInfo.name.includes("-")
      ? pokemonInfo.name.slice(pokemonInfo.name.indexOf("-") + 1)
      : "";

    const additionalForm =
      additionalFormTextRaw !== "" && REGION_NAME_EN_TO_KO.some((region) => additionalFormTextRaw.includes(region.eng))
        ? " (" +
          (REGION_NAME_EN_TO_KO.find((region) => additionalFormTextRaw.includes(region.eng))?.kor || "") +
          " 리전폼)"
        : "";

    const {data: speciesData} = await axios.get(speciesUrl);

    const newStatNamesMap: {[key: string]: string} = {
      hp: "hp",
      attack: "attack",
      defense: "defense",
      "special-attack": "specialAttack",
      "special-defense": "specialDefense",
      speed: "speed",
    };

    return {
      pokemonId: basicData.id,
      speciesId: speciesData.id,
      basicUrl: pokemonInfo.url,
      speciesUrl: speciesUrl,
      name: pokemonInfo.name,
      koreanName:
        (speciesData.names.find((nameItem: any) => nameItem.language.name === "ko")?.name || pokemonInfo.name) +
        additionalForm,
      types: basicData.types.map((typeInfo: any) => typeInfo.type.name),
      koreantypes: basicData.types
        .map((typeInfo: any) => typeInfo.type.name)
        .map(
          (typeName: string) => TYPE_NAME_EN_TO_KO.find((type) => type.typeName === typeName)?.korTypeName || typeName
        ),
      captureRate: speciesData.capture_rate,
      spriteUrl: basicData.sprites.front_default,
      stats: basicData.stats.map((statInfo: any) => ({
        statName: newStatNamesMap[statInfo.stat.name] || statInfo.stat.name,
        statValue: statInfo.base_stat,
      })),
    };
  });

  const learningPokemonsRaw = await Promise.all(promises);

  return learningPokemonsRaw.filter(
    (pokemon, index, self) => index === self.findIndex((p) => p.koreanName === pokemon.koreanName)
  );
};

// 유틸리티 함수: 버전 그룹명으로 세대 번호 조회
const getGenNumberByVersionGroup = (versionGroupName: string): number => {
  const genInfo = VERSION_GROUP_TO_GEN.find((gen) => gen.versionGroups.includes(versionGroupName));
  return genInfo?.genNumber || 0;
};

// 04. 검색된 포켓몬에 대해서 검색 대상 기술 배우는 방법 및 세대 정보 추가
export const addLearningMethodsAndGensToPokemons = async (
  pokemons: detailedPokemInfoType[],
  selectedMoves: selectedMoveType[]
) => {
  const updatedPokemonsPromises = pokemons.map(async (pokemon) => {
    const {data: pokemonData} = await axios.get(pokemon.basicUrl);

    const moveDetails: moveDetailType[] = [];

    selectedMoves.forEach((selectedMoveName) => {
      const moveObj = pokemonData.moves.find((moveItem: any) => moveItem.move.name === selectedMoveName.name);

      if (moveObj) {
        const versionDetails = moveObj.version_group_details.map((detail: any) => {
          const genNumber = getGenNumberByVersionGroup(detail.version_group.name);
          return {
            genNumber: genNumber,
            versionName: detail.version_group.name,
            learnMethod: detail.move_learn_method.name,
            learnedLevel: detail.level_learned_at,
          };
        });

        moveDetails.push({
          moveKorName: selectedMoveName.koreanName,
          versionDetails,
        });
      }
    });

    return {
      ...pokemon,
      ...(moveDetails.length > 0 && {moveDetails}),
    };
  });

  return await Promise.all(updatedPokemonsPromises);
};
