import {koreanMoveType} from "@/logic/pokeapiLogics/type";

export interface loadingStatesType {
  isInitialMovesLoading: boolean;
  isKoreanMovesLoading: boolean;
}

export interface zustandStoreType {
  loadingStates: loadingStatesType;
  setLoadingStates: (update: Partial<loadingStatesType> | ((prev: loadingStatesType) => loadingStatesType)) => void;

  koreanMoveStates: koreanMoveType[];
  setKoreanMoveStates: (update: koreanMoveType[]) => void;
}
