import {create} from "zustand";
import {zustandStoreType} from "./type";

export const useZustandStore = create<zustandStoreType>((set) => ({
  isFirstAccessToApp: true,
  setIsFirstAccessToApp: (update) => set(() => ({isFirstAccessToApp: update})),

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

  koreanMovesArrayStates: [],
  setKoreanMovesArrayStates: (update) =>
    set((state) => ({
      koreanMovesArrayStates: Array.isArray(update) ? update : state.koreanMovesArrayStates,
    })),

  selectedMovesArrayStates: [],
  setSelectedMovesArrayStates: (update) =>
    set((state) => {
      const next = typeof update === "function" ? update(state.selectedMovesArrayStates) : update;
      return {selectedMovesArrayStates: next};
    }),

  isToastMessageVisible: false,
  setIsToastMessageVisible: (update) => set(() => ({isToastMessageVisible: update})),
}));
