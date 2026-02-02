import {supabase} from "@/supabase/supabaseClient";
import {koreanMoveType} from "@/logic/pokeapiLogics/type";
import {getDBMeta, getFromDB, openDB, saveToDB} from "@/logic/indexedDBLogics/indexedDBLogics";
import {DB_NAME_KOREAN_MOVES, DB_VERSION, EXPIRE_MS, META_STORE, STORE_NAME_KOREAN_MOVES} from "@/store/constantStore";

// 1. Supabase fetching logic
const getKoreanMovesFromSupabase = async (): Promise<koreanMoveType[]> => {
  const {data, error} = await supabase.from("TB_MOVES").select("*");
  if (error) {
    throw new Error(error.message);
  }
  return data as koreanMoveType[];
};

// 2. IndexedDB Validation logic
const validateIndexedDB = async (db: IDBDatabase) => {
  const meta = await getDBMeta(db, META_STORE);
  const now = Date.now();

  if (meta && now - meta.addedAt <= EXPIRE_MS) {
    console.log("IndexedDB에 저장된 기술 데이터 유효함. 이를 Zustand에 저장해 활용.");
    return true;
  } else {
    console.log("IndexedDB에 저장된 기술 데이터 없음 또는 만료되었으므로, Supabase fetch 실행");
    return false;
  }
};

// 3. Validation 결과에 따라 indexedDB에서 불러오거나 Supabase에서 불러오는 통합 로직
export const generateValidKoreanMoves = async (): Promise<koreanMoveType[]> => {
  const db = await openDB(DB_NAME_KOREAN_MOVES, DB_VERSION, STORE_NAME_KOREAN_MOVES, META_STORE, "id");
  const isIndexedDbValid = await validateIndexedDB(db);

  if (isIndexedDbValid) {
    return (await getFromDB(db, STORE_NAME_KOREAN_MOVES)) as koreanMoveType[];
  }

  // Not valid in DB, fetch from Supabase
  const koreanMovesFromSupabase = await getKoreanMovesFromSupabase();

  if (koreanMovesFromSupabase.length > 0) {
    // Supabase에서 가져온 데이터를 IndexedDB에 저장
    await saveToDB(db, koreanMovesFromSupabase, STORE_NAME_KOREAN_MOVES, META_STORE);
  }

  return koreanMovesFromSupabase;
};
