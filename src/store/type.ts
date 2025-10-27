import {koreanMoveType, initialPokemonType, pokemonTypeEnNames, pokemonTypeKorNames} from "@/logic/pokeapiLogics/type";

export interface loadingStatesType {
  isInitialMovesLoading: boolean;
  isKoreanMovesLoading: boolean;
  isMovesLearningPokemonSearchLoading: boolean;

  isInitialPokemonsLoading: boolean;
  isDetailedPokemonsLoading: boolean;
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

  spriteUrl: string;

  captureRate?: number;

  stats: {statName: string; statValue: number}[];

  evStats?: {statName: string; evValue: number}[];

  moveDetails?: moveDetailType[];
}

export type sortOptionType = {
  alphabetical: boolean;
  hp: boolean;
  attack: boolean;
  defense: boolean;
  speed: boolean;
  specialAttack: boolean;
  specialDefense: boolean;
  hp_defense: boolean;
  hp_specialDefense: boolean;
  hp_defense_specialDefense: boolean;
  attack_speed: boolean;
  specialAttack_speed: boolean;
};

export interface zustandStoreType {
  isFirstAccessToSearchLearningPokemon: boolean;
  setIsFirstAccessToSearchLearningPokemon: (update: boolean) => void;

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

  pokemonsLearningAllLastSearchMoves: initialPokemonType[];
  setPokemonsLearningAllLastSearchMoves: (
    update: initialPokemonType[] | ((prev: initialPokemonType[]) => initialPokemonType[])
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

  sortOption: sortOptionType;
  setSortOption: (
    update: zustandStoreType["sortOption"] | ((prev: zustandStoreType["sortOption"]) => zustandStoreType["sortOption"])
  ) => void;

  sortAscDescOption: {
    asc: boolean;
    desc: boolean;
  };
  setSortAscDescOption: (
    update:
      | Partial<zustandStoreType["sortAscDescOption"]>
      | ((prev: zustandStoreType["sortAscDescOption"]) => zustandStoreType["sortAscDescOption"])
  ) => void;

  isToastMessageVisible: boolean;
  setIsToastMessageVisible: (update: boolean) => void;

  searchValue: string;
  setSearchValue: (update: string) => void;
  filteredMoves: koreanMoveType[];
  setFilteredMoves: (update: koreanMoveType[]) => void;

  isDropdownOpen01: boolean;
  setIsDropdownOpen01: (update: boolean) => void;

  isPokemonDropdownOpen: boolean;
  setIsPokemonDropdownOpen: (update: boolean) => void;

  isMoveSearchDebouncing: boolean;
  setIsMoveSearchDebouncing: (update: boolean) => void;

  isSelectingMoveForDeletionMode: boolean;
  setIsSelectingMoveForDeletionMode: (update: boolean) => void;

  isPokemonBucketCollectingOn: boolean;
  setIsPokemonBucketCollectingOn: (update: boolean) => void;

  resetSearchState: () => void;

  detailedPokemons: detailedPokemInfoType[];
  setDetailedPokemons: (update: detailedPokemInfoType[]) => void;

  isLearningPokemonBottomSheetOpen: boolean;
  setIsLearningPokemonBottomSheetOpen: (update: boolean) => void;
}
