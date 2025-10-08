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
  setSelectedMovesArrayStates: (update: koreanMoveType[]) => void;
}
