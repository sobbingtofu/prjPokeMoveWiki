import {supabase} from "@/supabase/supabaseClient";
import {koreanMoveType} from "@/logic/pokeapiLogics/type";
import {getDBMeta, getFromDB, openDB, saveToDB} from "@/logic/indexedDBLogics/indexedDBLogics";
import {
  DB_NAME_DETAILED_POKEMONS,
  DB_VERSION,
  EXPIRE_MS,
  META_STORE,
  STORE_NAME_DETAILED_POKEMONS,
} from "@/store/constantStore";
import {detailedPokemInfoType} from "@/store/type";

// 1. Supabase fetching logic
const getKoreanPokemonsFromSupabase = async (): Promise<detailedPokemInfoType[]> => {
  let allPokemons: detailedPokemInfoType[] = [];
  let from = 0;
  const BATCH_SIZE = 50; // 타임아웃 방지를 위한 작은 배치 사이즈
  let hasMore = true;

  while (hasMore) {
    const to = from + BATCH_SIZE - 1;
    console.log(`Fetching pokemons ${from} to ${to}...`);

    const {data, error} = await supabase.from("TB_POKEMONS").select("*").range(from, to);

    if (error) {
      throw new Error(error.message);
    }

    if (data && data.length > 0) {
      allPokemons = allPokemons.concat(data as detailedPokemInfoType[]);

      if (data.length < BATCH_SIZE) {
        hasMore = false;
      } else {
        from += BATCH_SIZE;
      }
    } else {
      hasMore = false;
    }
  }

  return allPokemons;
};

// 2. IndexedDB Validation logic
const validateIndexedDbDetailedPokemons = async (db: IDBDatabase) => {
  const meta = await getDBMeta(db, META_STORE);
  const now = Date.now();

  if (meta && now - meta.addedAt <= EXPIRE_MS) {
    console.log("IndexedDB에 저장된 상세 포켓몬 데이터 유효함. 이를 Zustand에 저장해 활용.");
    return true;
  } else {
    console.log("IndexedDB에 저장된 상세 포켓몬 데이터 없음 또는 만료되었으므로, Supabase fetch 실행");
    return false;
  }
};

// 3. Validation 결과에 따라 indexedDB에서 불러오거나 Supabase에서 불러오는 통합 로직
export const generateValidDetailedPokemons = async (): Promise<detailedPokemInfoType[]> => {
  const db = await openDB(DB_NAME_DETAILED_POKEMONS, DB_VERSION, STORE_NAME_DETAILED_POKEMONS, META_STORE, "pokemonId");
  const isIndexedDbValid = await validateIndexedDbDetailedPokemons(db);

  if (isIndexedDbValid) {
    return (await getFromDB(db, STORE_NAME_DETAILED_POKEMONS)) as detailedPokemInfoType[];
  }

  // Not valid in DB, fetch from Supabase
  const detailedPokemonsFromSupabase = await getKoreanPokemonsFromSupabase();

  if (detailedPokemonsFromSupabase.length > 0) {
    // Supabase에서 가져온 데이터를 IndexedDB에 저장
    await saveToDB(db, detailedPokemonsFromSupabase, STORE_NAME_DETAILED_POKEMONS, META_STORE);
  }

  return detailedPokemonsFromSupabase;
};
