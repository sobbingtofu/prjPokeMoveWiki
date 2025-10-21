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

// 02. 기술 국문명 추가 및 어떻게든 배우는 포켓몬 (영어이름 + url) 객체 배열 가져와
// learningPokemonEn 속성에 추가 > 얘를 03에서 활용
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
          )?.name ||
          MOVE_SUPPLEMENTARY_INFO.find((move) => move.name === initialMoveItem.name)?.addedKorName ||
          initialMoveItem.name,
        type: data.type.name,
        korType: TYPE_NAME_EN_TO_KO.find((type) => type.typeName === data.type.name)?.korTypeName || data.type.name,

        learningPokemonEn: data.learned_by_pokemon,
        // 기술을 배우는 포켓몬의 영어이름 & url 배열

        damageClass: data.damage_class.name,
        url: initialMoveItem.url,
        korDescription: (
          data.flavor_text_entries.findLast(
            (entry: {language: {name: string; url: string}; flavor_text: string}) => entry.language.name === "ko"
          )?.flavor_text ||
          data.flavor_text_entries.findLast(
            (entry: {language: {name: string; url: string}; flavor_text: string}) => entry.language.name === "en"
          )?.flavor_text ||
          ""
        )
          .replace(/\n/g, " ")
          .replace(/\s+/g, " ")
          .trim(),
        // hasKoreanName: !!data.names.find(
        //   (nameItem: {language: {name: string; url: string}; name: string}) => nameItem.language.name === "ko"
        // ),
        hasKoreanDescription: !!data.flavor_text_entries.findLast(
          (entry: {language: {name: string; url: string}; flavor_text: string}) => entry.language.name === "ko"
        ),
        power: data.power,
        accuracy: data.accuracy,
        pp: data.pp,
        priority: data.priority,
        effectChance: data.effect_chance,
        target: data.target.name,
      };
    });

    // 3. Promise.all을 기법 -  promises 배열의 각 promise가 해결(resolved)되면,
    // 그 결과값들로 이루어진 배열이 반환됨
    const koreanMoveNameArr = await Promise.all(promises);

    // 불필요한 기술 제거 (섀도우 기술)
    const filteredMoves = koreanMoveNameArr.filter(
      (move) => move.type !== "shadow" && !move.korDescription.includes("사용할 수 없는 기술")
    );

    // 4. 모든 데이터가 채워진 완전한 배열을 반환함
    return filteredMoves;
  } catch (error) {
    console.error("기술 국문 정보 호출 실패:", error);
    return [];
  }
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
  try {
    // 1. map을 사용하여 Promise의 배열인 promises 생성
    const promises = commonPokemons.map(async (pokemonInfo) => {
      const {data: basicData} = await axios.get(pokemonInfo.url);

      const speciesUrl = basicData.species.url;

      const additionalFormTextRaw = pokemonInfo.name.includes("-")
        ? pokemonInfo.name.slice(pokemonInfo.name.indexOf("-") + 1)
        : "";

      const additionalForm =
        additionalFormTextRaw !== "" &&
        REGION_NAME_EN_TO_KO.some((region) => additionalFormTextRaw.includes(region.eng))
          ? " (" +
            (REGION_NAME_EN_TO_KO.find((region) => additionalFormTextRaw.includes(region.eng))?.kor || "") +
            " 리전폼)"
          : "";

      const {data: speciesData} = await axios.get(speciesUrl);

      return {
        pokemonId: basicData.id,
        speciesId: speciesData.id,
        basicUrl: pokemonInfo.url,
        speciesUrl: speciesUrl,

        name: pokemonInfo.name,
        koreanName:
          (speciesData.names.find(
            (nameItem: {language: {name: string; url: string}; name: string}) => nameItem.language.name === "ko"
          )?.name || pokemonInfo.name) + additionalForm,

        types: basicData.types.map((typeInfo: {slot: number; type: {name: string; url: string}}) => typeInfo.type.name),

        koreantypes: basicData.types
          .map((typeInfo: {slot: number; type: {name: string; url: string}}) => typeInfo.type.name)
          .map(
            (typeName: string) => TYPE_NAME_EN_TO_KO.find((type) => type.typeName === typeName)?.korTypeName || typeName
          ),

        captureRate: speciesData.capture_rate,

        spriteUrl: basicData.sprites.front_default,

        stats: basicData.stats.map(
          (statInfo: {base_stat: number; effort: number; stat: {name: string; url: string}}) => ({
            statName: statInfo.stat.name,
            statValue: statInfo.base_stat,
          })
        ),
      };
    });

    // 3. Promise.all을 기법 -  promises 배열의 각 promise가 해결(resolved)되면,
    // 그 결과값들로 이루어진 배열이 반환됨
    const learningPokemonsRaw = await Promise.all(promises);

    const learningPokemons = learningPokemonsRaw.filter(
      (pokemon, index, self) => index === self.findIndex((p) => p.koreanName === pokemon.koreanName)
    );

    // 4. 모든 데이터가 채워진 완전한 배열을 반환함
    // console.log("학습 포켓몬 상세정보 호출 완료:", learningPokemons);
    return learningPokemons;
  } catch (error) {
    console.error("기술 국문 정보 호출 실패:", error);
    return [];
  }
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
  try {
    // 각 포켓몬별로 처리 map
    const updatedPokemonsPromises = pokemons.map(async (pokemon) => {
      // 포켓몬의 상세정보 조회
      const {data: pokemonData} = await axios.get(pokemon.basicUrl);

      // selectedMoves와 일치하는 기술들의 상세정보 추출해 넣을 배열 생성
      const moveDetails: moveDetailType[] = [];

      selectedMoves.forEach((selectedMoveName) => {
        // 포켓몬의 moves 배열에서 현재 기술 찾아 moveObj에 할당
        const moveObj = pokemonData.moves.find(
          (moveItem: {move: {name: string; url: string}; version_group_details: any[]}) =>
            moveItem.move.name === selectedMoveName.name
        );

        // 일치하는 기술이 있으면 (=moveObj가 있으면) moveDetails에 적절히 손봐서 추가
        if (moveObj) {
          const versionDetails = moveObj.version_group_details.map(
            (detail: {
              level_learned_at: number;
              move_learn_method: {name: string; url: string};
              version_group: {name: string; url: string};
            }) => {
              const genNumber = getGenNumberByVersionGroup(detail.version_group.name);
              return {
                genNumber: genNumber,
                versionName: detail.version_group.name,
                learnMethod: detail.move_learn_method.name,
                learnedLevel: detail.level_learned_at,
              };
            }
          );

          moveDetails.push({
            moveKorName: selectedMoveName.koreanName,
            versionDetails,
          });
        }
      });

      // moveDetails가 존재하면 포켓몬 객체에 추가
      return {
        ...pokemon,
        ...(moveDetails.length > 0 && {moveDetails}),
      };
    });

    const updatedPokemons = await Promise.all(updatedPokemonsPromises);

    // console.log("검색된 포켓몬에 대해서 검색 대상 기술 배우는 방법 및 세대 정보 추가 완료:", updatedPokemons);
    return updatedPokemons;
  } catch (error) {
    console.error("검색된 포켓몬에 대해서 검색 대상 기술 배우는 방법 및 세대 정보 추가 실패:", error);
    return [];
  }
};
