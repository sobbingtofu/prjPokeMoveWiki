import {
  initialMovesType,
  koreanMoveType,
  initialPokemonType,
  rawMoveDataFromPokmonDetailType,
  versionGroupDetailType,
  EvolutionChainDataType,
  EvolutionChainVarietyType,
} from "@/logic/pokeapiLogics/type";
import {
  API_CALLED_STAT_NAMES_MAP,
  MOVE_SUPPLEMENTARY_INFO,
  REGION_NAME_EN_TO_KO,
  TYPE_NAME_EN_TO_KO,
  VERSION_GROUP_TO_GEN,
} from "@/store/constantStore";
import {detailedPokemInfoType, moveDetailType, selectedMoveType, versionDetailType} from "@/store/type";
import {parseEvolutionChain} from "@/utils/parseEvolutionChain";
import {extractNumberBySplitting, getGenNumberByVersionGroup} from "@/utils/pokeApiUtils";
import axios from "axios";

// 01-1. 기술 raw data 배열 가져오기
export const getInitialMoveData = async () => {
  const {data: rawData} = await axios.get<any>("https://pokeapi.co/api/v2/move?offset=0&limit=1000");
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

// 01-2. 푸키먼 raw data 배열 가져오기
export const getInitialPokemons = async () => {
  const {data} = await axios.get<any>("https://pokeapi.co/api/v2/pokemon?&limit=1500");
  if (!Array.isArray(data.results)) {
    throw new Error(`Invalid data format: ${typeof data.results}`);
  }

  const initialPokemons: initialPokemonType[] = data.results.map((item: any, index: number) => ({
    id: extractNumberBySplitting(item.url) ? parseInt(extractNumberBySplitting(item.url)!) : index + 1,
    name: item.name,
    url: item.url,
  }));

  return initialPokemons;
};

// 02. 기술 국문명 추가 및 어떻게든 배우는 포켓몬 (영어이름 + url) 객체 배열 가져와 learningPokemonEn 속성에 추가
export const generateKoreanMoveData = async (initialMovesArr: initialMovesType[]) => {
  const promises = initialMovesArr.map(async (initialMoveItem) => {
    try {
      const {data} = await axios.get<any>(initialMoveItem.url, {timeout: 10000});

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
  const validMoves = koreanMoveNameArr.filter((move) => move !== null) as koreanMoveType[];

  return validMoves.filter((move) => move.type !== "shadow" && !move.korDescription.includes("사용할 수 없는 기술"));
};

// 03. 포켓몬의 상세정보 추가
export const generateDetailedPokemon = async (commonPokemons: initialPokemonType[]) => {
  console.log(`총 ${commonPokemons.length}개 포켓몬 처리 시작`);

  const BATCH_SIZE = 50; // 한 번에 50개씩 처리
  const results = [];

  for (let i = 0; i < commonPokemons.length; i += BATCH_SIZE) {
    const batch = commonPokemons.slice(i, i + BATCH_SIZE);
    console.log(`배치 ${i / BATCH_SIZE + 1} 처리 중 (${i + 1}~${Math.min(i + BATCH_SIZE, commonPokemons.length)})`);

    const promises = batch.map(async (pokemonInfo) => {
      try {
        const {data: basicData} = await axios.get<any>(pokemonInfo.url, {timeout: 10000});

        const speciesUrl = basicData.species.url;
        const alternateSpeciesUrl = `https://pokeapi.co/api/v2/pokemon-species/${basicData.name}/`;

        const additionalFormTextRaw = pokemonInfo.name.includes("-")
          ? pokemonInfo.name.slice(pokemonInfo.name.indexOf("-") + 1)
          : "";

        const additionalForm =
          additionalFormTextRaw !== "" && REGION_NAME_EN_TO_KO.some((region) => additionalFormTextRaw === region.eng)
            ? " (" +
              (REGION_NAME_EN_TO_KO.find((region) => additionalFormTextRaw.includes(region.eng))?.kor || "") +
              " 리전폼)"
            : "";

        let {data: speciesData} = await axios.get<any>(speciesUrl, {timeout: 5000});

        if (!speciesData || !speciesData.name || !speciesData.names || !Array.isArray(speciesData.names)) {
          console.warn(`포켓몬 ${pokemonInfo.name}의 speciesUrl이 유효하지 않아 alternateSpeciesUrl로 재시도`);

          try {
            const alternateResponse = await axios.get<any>(alternateSpeciesUrl, {timeout: 5000});
            speciesData = alternateResponse.data;

            // alternateSpeciesUrl로도 실패하면 null 반환
            if (!speciesData || !speciesData.name || !speciesData.names || !Array.isArray(speciesData.names)) {
              console.error(`포켓몬 ${pokemonInfo.name}의 alternateSpeciesUrl도 유효하지 않음`);
              return null;
            }
          } catch (alternateError) {
            console.error(`포켓몬 ${pokemonInfo.name}의 alternateSpeciesUrl 호출 실패:`, alternateError);
            return null;
          }
        }

        const koreanNameFromSpecies = speciesData?.names?.find?.(
          (nameItem: any) => nameItem.language.name === "ko"
        )?.name;

        return {
          pokemonId: basicData.id,
          speciesId: speciesData.id,

          name: pokemonInfo.name,
          koreanName: (koreanNameFromSpecies || pokemonInfo.name) + additionalForm,

          basicUrl: pokemonInfo.url,
          speciesUrl: speciesUrl,

          types: basicData.types.map((typeInfo: any) => typeInfo.type.name),
          koreantypes: basicData.types
            .map((typeInfo: any) => typeInfo.type.name)
            .map(
              (typeName: string) =>
                TYPE_NAME_EN_TO_KO.find((type) => type.typeName === typeName)?.korTypeName || typeName
            ),

          spriteUrl: basicData.sprites.front_default,
          officialArtworkUrl: basicData.sprites.other["official-artwork"].front_default || null,

          stats: basicData.stats.map((statInfo: any) => ({
            statName: API_CALLED_STAT_NAMES_MAP[statInfo.stat.name] || statInfo.stat.name,
            statValue: statInfo.base_stat,
          })),
          evStats: basicData.stats
            .filter((statInfo: any) => statInfo.effort > 0)
            .map((statInfo: any) => ({
              statName: API_CALLED_STAT_NAMES_MAP[statInfo.stat.name] || statInfo.stat.name,
              evValue: statInfo.effort,
            })),

          abilities: basicData.abilities.map((abilityInfo: any) => ({
            abilityName: abilityInfo.ability.name,
            abilityUrl: abilityInfo.ability.url,
            hidden: abilityInfo.is_hidden,
          })),

          // captureRate: speciesData.capture_rate,

          evolutionChainUrl: speciesData.evolution_chain.url,

          moveRawData: basicData.moves,
        };
      } catch (error) {
        console.error(`포켓몬 ${pokemonInfo.name} 처리 실패:`, error);
        return null;
      }
    });

    const batchResults = await Promise.all(promises);
    results.push(...batchResults.filter((r) => r !== null));

    // 다음 배치 전 잠시 대기 (rate limit 방지)
    if (i + BATCH_SIZE < commonPokemons.length) {
      await new Promise((resolve) => setTimeout(resolve, 200));
    }
  }

  const seen = new Set<string>();
  const finalData = results.filter((pokemon) => {
    if (seen.has(pokemon.koreanName)) return false;
    seen.add(pokemon.koreanName);
    return true;
  });

  console.log("최종 데이터:", finalData.length, "개");
  return finalData;
};

// 04. 검색된 포켓몬에 대해서 검색 대상 기술 배우는 방법 및 세대 정보 추가
export const addLearningMethodsAndGensToPokemons = async (
  pokemons: detailedPokemInfoType[],
  selectedMoves: selectedMoveType[]
) => {
  const updatedPokemonsPromises = pokemons.map(async (pokemon) => {
    const {data: pokemonData} = await axios.get<any>(pokemon.basicUrl);

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

// 05. 포켓몬 특성 상세 정보 가져오기
export const fetchPokemonAbilityData = async (abilities: detailedPokemInfoType["abilities"]) => {
  const abilityDetailsPromises = abilities.map(async (ability) => {
    try {
      const {data: abilityData} = await axios.get<any>(ability.abilityUrl);

      // console.log("abilityData.flavor_text_entries:", abilityData.flavor_text_entries);

      const abilityNameKo =
        abilityData.names.find((nameItem: any) => nameItem.language.name === "ko")?.name || ability.abilityName;

      const abilityDescriptionEnArray =
        (abilityData.flavor_text_entries.filter((entry: any) => entry.language.name === "en") || []).map(
          (entry: any) => entry.flavor_text
        ) || [];

      const abilityDescriptionKoArray =
        (abilityData.flavor_text_entries.filter((entry: any) => entry.language.name === "ko") || []).map(
          (entry: any) => entry.flavor_text
        ) || [];

      return {
        hidden: ability.hidden,

        abilityNameEn: ability.abilityName,
        abilityNameKo: abilityNameKo,

        descriptionEn: abilityDescriptionEnArray.pop() || "",
        descriptionKo: abilityDescriptionKoArray.pop() || "",
      };
    } catch (abilityError) {
      console.error(`포켓몬 특성 ${ability.abilityName} 데이터 조회 실패:`, abilityError);
      return null;
    }
  });
  const abilityDetails = await Promise.all(abilityDetailsPromises);
  return abilityDetails;
};

// 06. 기술 국문명 추가
export const generateKoreanMoveData02 = async (
  rawMoveData: rawMoveDataFromPokmonDetailType[]
): Promise<koreanMoveType[]> => {
  const promises = rawMoveData.map(async (rawMoveItem) => {
    try {
      const {data} = await axios.get<any>(rawMoveItem.move.url, {timeout: 10000});

      const moveKorName =
        data.names.find((nameItem: any) => nameItem.language.name === "ko")?.name ||
        MOVE_SUPPLEMENTARY_INFO.find((move) => move.name === rawMoveItem.move.name)?.addedKorName ||
        rawMoveItem.move.name;

      const versionGroupDetails: versionGroupDetailType[] = rawMoveItem.version_group_details.map((detail) => {
        const genNumber = getGenNumberByVersionGroup(detail.version_group.name);

        return {
          genNumber: genNumber,
          versionName: detail.version_group.name,
          levelLearned: detail.level_learned_at,
          learnMethod: detail.move_learn_method.name,
        };
      });

      return {
        id: data.id,
        name: rawMoveItem.move.name,
        koreanName: moveKorName,
        type: data.type.name,
        korType: TYPE_NAME_EN_TO_KO.find((type) => type.typeName === data.type.name)?.korTypeName || data.type.name,
        damageClass: data.damage_class.name,
        url: rawMoveItem.move.url,
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
        versionGroupDetails: versionGroupDetails,
      } as koreanMoveType;
    } catch (itemError) {
      console.error(`기술 ${rawMoveItem.move.name} 데이터 조회 실패:`, itemError);
      return null;
    }
  });

  const koreanMoveNameArr = await Promise.all(promises);

  return koreanMoveNameArr.filter(
    (move): move is koreanMoveType =>
      move !== null && move.type !== "shadow" && !move.korDescription.includes("사용할 수 없는 기술")
  );
};

// 07. 진화 정보 가져오기
export const getEvolChainData = async (evolutionChainUrl: string): Promise<EvolutionChainDataType> => {
  const {data} = await axios.get<any>(evolutionChainUrl, {timeout: 10000});

  const refinedData = parseEvolutionChain(data);

  const speciesPromises = refinedData.map(async (pokemonSpeciesItem) => {
    try {
      const {data: speciesData} = await axios.get<any>(pokemonSpeciesItem.url, {timeout: 10000});
      const chainLevel = pokemonSpeciesItem.chainLevel;
      const pokemonSpeciesNameEn = pokemonSpeciesItem.name;
      const pokemonSpeciesNameKo = speciesData?.names?.find?.((nameItem: any) => nameItem.language.name === "ko")?.name;
      const pokemonVarieties = speciesData?.varieties;

      const varietyPromises = pokemonVarieties.map(
        async (varietyItem: any): Promise<EvolutionChainVarietyType | null> => {
          try {
            const {data: varietyData} = await axios.get<any>(varietyItem.pokemon.url, {timeout: 10000});

            return {
              chainLevel: chainLevel,
              pokemonVarietyNameEn: varietyItem.pokemon.name,
              pokemonSpeciesNameEn: pokemonSpeciesNameEn,
              pokemonSpeciesNameKo: pokemonSpeciesNameKo,
              pokemonId: varietyData.id || "",
              pokemonUrl: varietyItem.pokemon.url || "",
              speciesUrl: varietyData.species.url || "",
              spriteUrl: varietyData.sprites.front_default || "",
              officialArtworkUrl: varietyData.sprites.other["official-artwork"].front_default || "",
              types: varietyData.types || [],
            };
          } catch (error) {
            console.error(`포켓몬 ${pokemonSpeciesNameEn} 처리 실패:`, error);
            return null;
          }
        }
      );

      const returnVal = await Promise.all(varietyPromises);

      const filtered = returnVal.filter((item): item is EvolutionChainVarietyType => {
        if (!item) return false;

        const varietyKeyword = extractSuffix(item.pokemonVarietyNameEn);

        function extractSuffix(str: string) {
          const parts = str.split("-");
          return parts.length > 1 ? parts[parts.length - 1] : "";
        }
        function isValidRegion(value: string) {
          return REGION_NAME_EN_TO_KO.some((region) => region.eng === value);
        }
        if (isValidRegion(varietyKeyword) || varietyKeyword == "") {
          return true;
        } else {
          return false;
        }
      });

      return filtered;
    } catch (error) {
      console.error(`포켓몬 ${pokemonSpeciesItem.name} 처리 실패:`, error);
      return [];
    }
  });

  const speciesData = await Promise.all(speciesPromises);

  const flattenedSpeciesData = speciesData.flat();
  return flattenedSpeciesData;
};
