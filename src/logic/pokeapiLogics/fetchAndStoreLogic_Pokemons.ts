import {
  DB_NAME_KOREAN_MOVES,
  DB_NAME_DETAILED_POKEMONS,
  DB_VERSION,
  EXPIRE_MS,
  META_STORE,
  STORE_NAME_DETAILED_POKEMONS,
} from "@/store/constantStore";
import {getDBMeta, getFromDB, openDB, saveToDB} from "../indexedDBLogics/indexedDBLogics";
import {initialMovesType, initialPokemonType, koreanMoveType} from "./type";
import {generateDetailedPokemon} from "./fetchMovePokemonLogics";
import {detailedPokemInfoType} from "@/store/type";

interface FetchPokemonsResult {
  successPokemons: detailedPokemInfoType[];
  failedInitialPokemons: initialPokemonType[];
}

const fetchDetailedPokemonsOnce = async (initialPokemonsParam: initialPokemonType[]): Promise<FetchPokemonsResult> => {
  const successPokemons: detailedPokemInfoType[] = [];
  const failedInitialPokemons: initialPokemonType[] = [];

  const promises = initialPokemonsParam.map(async (pokemonItem) => {
    try {
      const result = await generateDetailedPokemon([pokemonItem]);

      if (result && result.length > 0) {
        return {success: true, pokemon: result[0], originalItem: pokemonItem};
      } else {
        return {success: false, pokemon: null, originalItem: pokemonItem};
      }
    } catch (error) {
      console.error(`포켓몬 ${pokemonItem.name} 처리 실패:`, error);
      return {success: false, pokemon: null, originalItem: pokemonItem};
    }
  });

  const results = await Promise.allSettled(promises);

  results.forEach((result) => {
    if (result.status === "fulfilled") {
      if (result.value.success && result.value.pokemon) {
        successPokemons.push(result.value.pokemon);
      } else {
        failedInitialPokemons.push(result.value.originalItem);
      }
    } else {
      console.error("Promise rejected:", result.reason);
    }
  });

  return {successPokemons, failedInitialPokemons};
};

const fetchDetailedPokemonsWithRetry = async (
  initialPokemonsParam: initialPokemonType[],
  onSuccessBatch: (pokemons: detailedPokemInfoType[]) => Promise<void>,
  maxRetries: number = 5
): Promise<void> => {
  let failedPokemons: initialPokemonType[] = initialPokemonsParam;
  let retryCount = 0;

  console.log(`최초 시도: ${failedPokemons.length}개 포켓몬 처리 중...`);
  const firstResult = await fetchDetailedPokemonsOnce(failedPokemons);

  if (firstResult.successPokemons.length > 0) {
    console.log(`최초 시도 성공: ${firstResult.successPokemons.length}개`);
    await onSuccessBatch(firstResult.successPokemons);
  }

  failedPokemons = firstResult.failedInitialPokemons;
  console.log(`최초 시도 실패: ${failedPokemons.length}개`);

  while (failedPokemons.length > 0 && retryCount < maxRetries) {
    retryCount++;

    const waitTime = Math.min(1000 * Math.pow(2, retryCount), 10000);
    console.log(`${waitTime}ms 대기 후 재시도 ${retryCount}/${maxRetries}...`);
    await new Promise((resolve) => setTimeout(resolve, waitTime));

    console.log(`재시도 ${retryCount}/${maxRetries}: ${failedPokemons.length}개 포켓몬 처리 중...`);

    const result = await fetchDetailedPokemonsOnce(failedPokemons);

    if (result.successPokemons.length > 0) {
      console.log(`재시도 ${retryCount} 성공: ${result.successPokemons.length}개`);
      await onSuccessBatch(result.successPokemons);
    }

    failedPokemons = result.failedInitialPokemons;
    console.log(`재시도 ${retryCount} 실패: ${failedPokemons.length}개`);
  }

  if (failedPokemons.length > 0) {
    console.warn(
      `최대 재시도 횟수 도달. ${failedPokemons.length}개 포켓몬 처리 최종 실패:`,
      failedPokemons.map((p) => p.name)
    );
  } else {
    console.log(`모든 포켓몬 처리 완료!`);
  }
};

export const fetchAndStoreDetailedPokemons = async (
  initialPokemonsParam: initialPokemonType[],
  onProgressUpdate?: (currentPokemons: detailedPokemInfoType[]) => void
) => {
  const db = await openDB(DB_NAME_DETAILED_POKEMONS, DB_VERSION, STORE_NAME_DETAILED_POKEMONS, META_STORE, "pokemonId");

  const meta = await getDBMeta(db, META_STORE);
  const now = Date.now();

  if (meta && now - meta.addedAt <= EXPIRE_MS) {
    console.log("IndexedDB에서 포켓몬 데이터 가져오기");
    return await getFromDB(db, STORE_NAME_DETAILED_POKEMONS);
  }

  console.log("API에서 포켓몬 데이터 가져오기 (재시도 로직 포함)");

  let allPokemons: detailedPokemInfoType[] = [];

  const handleSuccessBatch = async (newPokemons: detailedPokemInfoType[]) => {
    const existingPokemons = await getFromDB(db, STORE_NAME_DETAILED_POKEMONS);

    allPokemons = [...allPokemons, ...newPokemons];
    const combinedPokemons = [...existingPokemons, ...newPokemons];

    console.log(`DB에 ${newPokemons.length}개 포켓몬 데이터 추가 저장 (총 ${combinedPokemons.length}개)`);
    await saveToDB(db, combinedPokemons, STORE_NAME_DETAILED_POKEMONS, META_STORE);

    if (onProgressUpdate) {
      onProgressUpdate(combinedPokemons);
    }
  };

  await fetchDetailedPokemonsWithRetry(initialPokemonsParam, handleSuccessBatch);

  const finalPokemons = await getFromDB(db, STORE_NAME_DETAILED_POKEMONS);
  return finalPokemons;
};
