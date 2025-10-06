export interface initialMovesType {
  id: number;
  name: string;
  url: string;
}

export interface koreanMoveType {
  id: number;
  name: string;
  koreanName: string;
  type: pokemonTypeType;
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
