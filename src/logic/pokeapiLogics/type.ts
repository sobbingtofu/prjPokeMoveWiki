export interface initialMovesType {
  id: number;
  name: string;
  url: string;
}

export interface versionGroupDetailType {
  versionName: string;
  levelLearned: number;
  learnMethod: string;
}

export interface initialPokemonType {
  id?: number;
  name: string;
  url: string;
  version_group_details?: versionGroupDetailType[];
}

export type damageClassType = "physical" | "special" | "status";

export interface koreanMoveType {
  id: number;
  name: string;
  koreanName: string;
  type: pokemonTypeEnNames;
  korType: string;
  learningPokemonEn: initialPokemonType[];
  damageClass: damageClassType;
  url: string;
  hasKoreanName?: boolean;
  korDescription: string;
  hasKoreanDescription: boolean;
  power: number | null;
  accuracy: number | null;
  pp: number | null;
  priority: number;
  effectChance: number | null;
  target: string;
}

export type pokemonTypeEnNames =
  | "normal"
  | "fighting"
  | "flying"
  | "poison"
  | "ground"
  | "rock"
  | "bug"
  | "ghost"
  | "steel"
  | "fire"
  | "water"
  | "grass"
  | "electric"
  | "psychic"
  | "ice"
  | "dragon"
  | "dark"
  | "fairy"
  | "unknown"
  | "shadow"
  | "stellar";

export type pokemonTypeKorNames =
  | "노말"
  | "격투"
  | "비행"
  | "독"
  | "땅"
  | "바위"
  | "벌레"
  | "고스트"
  | "강철"
  | "불"
  | "물"
  | "풀"
  | "전기"
  | "에스퍼"
  | "얼음"
  | "드래곤"
  | "악"
  | "페어리"
  | "???"
  | "스텔라";
