import {koreanMoveType, pokemonBasicInfoType} from "@/logic/pokeapiLogics/type";

export interface loadingStatesType {
  isInitialMovesLoading: boolean;
  isKoreanMovesLoading: boolean;
  isMovesLearningPokemonSearchLoading: boolean;
}
export interface selectedMoveType extends koreanMoveType {
  isSelectedForDeletion: boolean;
}

export interface detailedPokemInfoType {
  pokemonId: string;
  speciesId: string;

  name: string;

  basicUrl: string;
  speciesUrl: string;

  koreanName: string;

  koreantypes: string[];

  captureRate: number;
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

  detailedLearningPokemons: detailedPokemInfoType[];
  setDetailedLearningPokemons: (
    update: detailedPokemInfoType[] | ((prev: detailedPokemInfoType[]) => detailedPokemInfoType[])
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
