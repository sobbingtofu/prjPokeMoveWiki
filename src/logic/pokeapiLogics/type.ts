export interface initialMovesType {
  id: number;
  name: string;
  url: string;
}

export type damageClassType = "physical" | "special" | "status";

export interface koreanMoveType {
  id: number;
  name: string;
  koreanName: string;
  type: pokemonTypeType;
  learningPokemonEn: {name: string; url: string}[];
  damageClass: damageClassType;
}

export type pokemonTypeType =
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
  | "stellar";
