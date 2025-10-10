import {koreanMoveType} from "@/logic/pokeapiLogics/type";

export interface loadingStatesType {
  isInitialMovesLoading: boolean;
  isKoreanMovesLoading: boolean;
}

export interface zustandStoreType {
  isFirstAccessToApp: boolean;
  setIsFirstAccessToApp: (update: boolean) => void;

  loadingStates: loadingStatesType;
  setLoadingStates: (update: Partial<loadingStatesType> | ((prev: loadingStatesType) => loadingStatesType)) => void;

  koreanMovesArrayStates: koreanMoveType[];
  setKoreanMovesArrayStates: (update: koreanMoveType[]) => void;

  selectedMovesArrayStates: koreanMoveType[];
  setSelectedMovesArrayStates: (update: koreanMoveType[] | ((prev: koreanMoveType[]) => koreanMoveType[])) => void;

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
}
