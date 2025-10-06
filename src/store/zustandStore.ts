import {create} from "zustand";
import {zustandStoreType} from "./type";

export const useZustandStore = create<zustandStoreType>((set) => ({
  loadingStates: {
    isInitialMovesLoading: false,
    isKoreanMovesLoading: false,
  },
  setLoadingStates: (update) =>
    set((state) => {
      const prev = state.loadingStates;
      const next = typeof update === "function" ? update(prev) : {...prev, ...update};
      return {loadingStates: next};
    }),

  koreanMoveStates: [],
  setKoreanMoveStates: (update) =>
    set((state) => ({
      koreanMoveStates: Array.isArray(update) ? update : state.koreanMoveStates,
    })),
}));
