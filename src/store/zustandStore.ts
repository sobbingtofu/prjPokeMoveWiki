import {create} from "zustand";
import {zustandStoreType} from "./type";

export const useZustandStore = create<zustandStoreType>((set) => ({
  isFirstAccessToApp: true,
  setIsFirstAccessToApp: (update) => set(() => ({isFirstAccessToApp: update})),

  loadingStates: {
    isInitialMovesLoading: false,
    isKoreanMovesLoading: false,
    isMovesLearningPokemonSearchLoading: false,
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

  lastSearchMovesArrayStates: [],
  setLastSearchMovesArrayStates: (update) =>
    set((state) => {
      const next = typeof update === "function" ? update(state.lastSearchMovesArrayStates) : update;
      return {lastSearchMovesArrayStates: next};
    }),

  pokemonsLearningAllLastSearchMoves: [],
  setPokemonsLearningAllLastSearchMoves: (update) =>
    set((state) => {
      const next = typeof update === "function" ? update(state.pokemonsLearningAllLastSearchMoves) : update;
      return {pokemonsLearningAllLastSearchMoves: next};
    }),

  detailedLearningPokemons_PreFilter: [],
  setDetailedLearningPokemons_PreFilter: (update) =>
    set((state) => {
      const next = typeof update === "function" ? update(state.detailedLearningPokemons_PreFilter) : update;
      return {detailedLearningPokemons_PreFilter: next};
    }),

  genFilter: {
    gen1: true,
    gen2: true,
    gen3: true,
    gen4: true,
    gen5: true,
    gen6: true,
    gen7: true,
    gen8: true,
    gen9: true,
  },
  setGenFilter: (update) =>
    set((state) => {
      const prev = state.genFilter;
      const next = typeof update === "function" ? update(prev) : {...prev, ...update};
      return {genFilter: next};
    }),

  learnMethodFilter: {
    levelUp: true,
    tutor: true,
    machine: true,
  },
  setLearnMethodFilter: (update) =>
    set((state) => {
      const prev = state.learnMethodFilter;
      const next = typeof update === "function" ? update(prev) : {...prev, ...update};
      return {learnMethodFilter: next};
    }),

  sortOption: {
    hp: false,
    attack: false,
    defense: false,
    speed: false,
    specialAttack: false,
    specialDefense: false,
  },
  setSortOption: (update) =>
    set((state) => {
      const prev = state.sortOption;
      const next = typeof update === "function" ? update(prev) : {...prev, ...update};
      return {sortOption: next};
    }),

  isToastMessageVisible: false,
  setIsToastMessageVisible: (update) => set(() => ({isToastMessageVisible: update})),

  searchValue: "",
  setSearchValue: (update) => set({searchValue: update}),

  filteredMoves: [],
  setFilteredMoves: (update) => set({filteredMoves: update}),

  isDropdownOpen: false,
  setIsDropdownOpen: (update) => set({isDropdownOpen: update}),

  isDebouncing: false,
  setIsDebouncing: (update) => set({isDebouncing: update}),

  isSelectingForDeletionMode: false,
  setIsSelectingForDeletionMode: (update) => set({isSelectingForDeletionMode: update}),
}));
