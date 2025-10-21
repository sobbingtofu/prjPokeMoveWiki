import {
  koreanMoveType,
  pokemonBasicInfoType,
  pokemonTypeEnNames,
  pokemonTypeKorNames,
} from "@/logic/pokeapiLogics/type";

export interface loadingStatesType {
  isInitialMovesLoading: boolean;
  isKoreanMovesLoading: boolean;
  isMovesLearningPokemonSearchLoading: boolean;
}
export interface selectedMoveType extends koreanMoveType {
  isSelectedForDeletion: boolean;
}

export interface versionDetailType {
  genNumber: number;
  versionName: string;
  learnMethod: string;
  learnedLevel: number;
}

export interface moveDetailType {
  moveKorName: string;
  versionDetails: versionDetailType[];
}

export interface detailedPokemInfoType {
  pokemonId: string;
  speciesId: string;

  name: string;

  basicUrl: string;
  speciesUrl: string;

  koreanName: string;

  types: pokemonTypeEnNames[];
  koreantypes: pokemonTypeKorNames[];

  captureRate: number;

  spriteUrl: string;

  stats: {statName: string; statValue: number}[];

  moveDetails?: moveDetailType[];
}

export interface zustandStoreType {
  isFirstAccessToApp: boolean;
  setIsFirstAccessToApp: (update: boolean) => void;

  loadingStates: loadingStatesType;
  setLoadingStates: (update: Partial<loadingStatesType> | ((prev: loadingStatesType) => loadingStatesType)) => void;

  koreanMovesArrayStates: koreanMoveType[];
  setKoreanMovesArrayStates: (update: koreanMoveType[]) => void;

  selectedMovesArrayStates: selectedMoveType[];
  setSelectedMovesArrayStates: (
    update: selectedMoveType[] | ((prev: selectedMoveType[]) => selectedMoveType[])
  ) => void;

  lastSearchMovesArrayStates: selectedMoveType[];
  setLastSearchMovesArrayStates: (
    update: selectedMoveType[] | ((prev: selectedMoveType[]) => selectedMoveType[])
  ) => void;

  pokemonsLearningAllLastSearchMoves: pokemonBasicInfoType[];
  setPokemonsLearningAllLastSearchMoves: (
    update: pokemonBasicInfoType[] | ((prev: pokemonBasicInfoType[]) => pokemonBasicInfoType[])
  ) => void;

  detailedLearningPokemons_PreFilter: detailedPokemInfoType[];
  setDetailedLearningPokemons_PreFilter: (
    update: detailedPokemInfoType[] | ((prev: detailedPokemInfoType[]) => detailedPokemInfoType[])
  ) => void;

  detailedLearningPokemons_Filtered: detailedPokemInfoType[];
  setDetailedLearningPokemons_Filtered: (
    update: detailedPokemInfoType[] | ((prev: detailedPokemInfoType[]) => detailedPokemInfoType[])
  ) => void;

  genFilter: {
    gen1: boolean;
    gen2: boolean;
    gen3: boolean;
    gen4: boolean;
    gen5: boolean;
    gen6: boolean;
    gen7: boolean;
    gen8: boolean;
    gen9: boolean;
  };
  setGenFilter: (
    update:
      | Partial<zustandStoreType["genFilter"]>
      | ((prev: zustandStoreType["genFilter"]) => zustandStoreType["genFilter"])
  ) => void;

  learnMethodFilter: {
    "level-up": boolean;
    tutor: boolean;
    machine: boolean;
  };

  setLearnMethodFilter: (
    update:
      | Partial<zustandStoreType["learnMethodFilter"]>
      | ((prev: zustandStoreType["learnMethodFilter"]) => zustandStoreType["learnMethodFilter"])
  ) => void;

  sortOption: {
    hp: boolean;
    attack: boolean;
    defense: boolean;
    specialAttack: boolean;
    specialDefense: boolean;
    speed: boolean;
  };
  setSortOption: (
    update: zustandStoreType["sortOption"] | ((prev: zustandStoreType["sortOption"]) => zustandStoreType["sortOption"])
  ) => void;

  isToastMessageVisible: boolean;
  setIsToastMessageVisible: (update: boolean) => void;

  searchValue: string;
  setSearchValue: (update: string) => void;
  filteredMoves: koreanMoveType[];
  setFilteredMoves: (update: koreanMoveType[]) => void;
  isDropdownOpen: boolean;
  setIsDropdownOpen: (update: boolean) => void;
  isDebouncing: boolean;
  setIsDebouncing: (update: boolean) => void;

  isSelectingForDeletionMode: boolean;
  setIsSelectingForDeletionMode: (update: boolean) => void;
}
