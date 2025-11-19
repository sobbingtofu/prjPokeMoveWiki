// 포켓몬 타입 정의
export type generalPokemonTypes =
  | "normal"
  | "fire"
  | "water"
  | "electric"
  | "grass"
  | "ice"
  | "fighting"
  | "poison"
  | "ground"
  | "flying"
  | "psychic"
  | "bug"
  | "rock"
  | "ghost"
  | "dragon"
  | "dark"
  | "steel"
  | "fairy";

// 데미지 배율 타입
type DamageMultiplier = 0 | 0.5 | 1 | 2 | 4;

// 타입별 상성 차트 타입
type TypeMatchup = Partial<Record<generalPokemonTypes, DamageMultiplier>>;

// 방어 상성 결과 타입
interface DefenseMatchupResult {
  400: generalPokemonTypes[];
  200: generalPokemonTypes[];
  100: generalPokemonTypes[];
  50: generalPokemonTypes[];
  25: generalPokemonTypes[];
  0: generalPokemonTypes[];
}

const TYPE_CHART: Record<generalPokemonTypes, TypeMatchup> = {
  normal: {fighting: 2, ghost: 0},
  fire: {water: 2, ground: 2, rock: 2, fire: 0.5, grass: 0.5, ice: 0.5, bug: 0.5, steel: 0.5, fairy: 0.5},
  water: {electric: 2, grass: 2, water: 0.5, fire: 0.5, ice: 0.5, steel: 0.5},
  electric: {ground: 2, electric: 0.5, flying: 0.5, steel: 0.5},
  grass: {fire: 2, ice: 2, poison: 2, flying: 2, bug: 2, water: 0.5, electric: 0.5, grass: 0.5, ground: 0.5},
  ice: {fire: 2, fighting: 2, rock: 2, steel: 2, ice: 0.5},
  fighting: {flying: 2, psychic: 2, fairy: 2, bug: 0.5, rock: 0.5, dark: 0.5},
  poison: {ground: 2, psychic: 2, fighting: 0.5, poison: 0.5, bug: 0.5, grass: 0.5, fairy: 0.5},
  ground: {water: 2, grass: 2, ice: 2, poison: 0.5, rock: 0.5, electric: 0},
  flying: {electric: 2, ice: 2, rock: 2, fighting: 0.5, bug: 0.5, grass: 0.5, ground: 0},
  psychic: {bug: 2, ghost: 2, dark: 2, fighting: 0.5, psychic: 0.5},
  bug: {fire: 2, flying: 2, rock: 2, fighting: 0.5, grass: 0.5, ground: 0.5},
  rock: {water: 2, grass: 2, fighting: 2, ground: 2, steel: 2, normal: 0.5, fire: 0.5, poison: 0.5, flying: 0.5},
  ghost: {ghost: 2, dark: 2, poison: 0.5, bug: 0.5, normal: 0, fighting: 0},
  dragon: {ice: 2, dragon: 2, fairy: 2, fire: 0.5, water: 0.5, electric: 0.5, grass: 0.5},
  dark: {fighting: 2, bug: 2, fairy: 2, ghost: 0.5, dark: 0.5, psychic: 0},
  steel: {
    fire: 2,
    fighting: 2,
    ground: 2,
    normal: 0.5,
    grass: 0.5,
    ice: 0.5,
    flying: 0.5,
    psychic: 0.5,
    bug: 0.5,
    rock: 0.5,
    dragon: 0.5,
    steel: 0.5,
    fairy: 0.5,
    poison: 0,
  },
  fairy: {poison: 2, steel: 2, fighting: 0.5, bug: 0.5, dark: 0.5, dragon: 0},
};

const GENERAL_POKEMON_TYPES: generalPokemonTypes[] = [
  "normal",
  "fire",
  "water",
  "electric",
  "grass",
  "ice",
  "fighting",
  "poison",
  "ground",
  "flying",
  "psychic",
  "bug",
  "rock",
  "ghost",
  "dragon",
  "dark",
  "steel",
  "fairy",
];

export function getPokemonDefenseMatchup(receivedTypes: generalPokemonTypes[]): DefenseMatchupResult {
  // damageMultipliers라는 빈 객체 => 여기에 각 공격 타입별 최종 배율을 저장
  const damageMultipliers: Record<generalPokemonTypes, number> = {} as Record<generalPokemonTypes, number>;

  GENERAL_POKEMON_TYPES.forEach((attackType: generalPokemonTypes) => {
    let multiplier: number = 1;

    // 각 방어 타입에 대해 배율 곱하기
    receivedTypes.forEach((defenseType: generalPokemonTypes) => {
      const chart = TYPE_CHART[defenseType];
      if (chart && chart[attackType] !== undefined) {
        multiplier = multiplier * chart[attackType]!;
      }
    });

    damageMultipliers[attackType] = multiplier;
  });

  console.log("damageMultipliers after calculation:", damageMultipliers);

  // 배율별로 분류
  const result: DefenseMatchupResult = {
    400: [],
    200: [],
    100: [],
    50: [],
    25: [],
    0: [],
  };

  Object.entries(damageMultipliers).forEach(([type, multiplier]: [string, number]) => {
    const pokemonType = type as generalPokemonTypes;
    if (multiplier === 4) {
      result[400].push(pokemonType);
    } else if (multiplier === 2) {
      result[200].push(pokemonType);
    } else if (multiplier === 1) {
      result[100].push(pokemonType);
    } else if (multiplier === 0.5) {
      result[50].push(pokemonType);
    } else if (multiplier === 0.25) {
      result[25].push(pokemonType);
    } else if (multiplier === 0) {
      result[0].push(pokemonType);
    }
  });

  return result;
}
