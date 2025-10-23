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

  detailedLearningPokemons_Filtered: [],
  setDetailedLearningPokemons_Filtered: (update) =>
    set((state) => {
      const next = typeof update === "function" ? update(state.detailedLearningPokemons_Filtered) : update;
      return {detailedLearningPokemons_Filtered: next};
    }),

  genFilter: {
    gen1: false,
    gen2: false,
    gen3: false,
    gen4: false,
    gen5: false,
    gen6: false,
    gen7: false,
    gen8: false,
    gen9: true,
  },
  setGenFilter: (update) =>
    set((state) => {
      const prev = state.genFilter;
      const next = typeof update === "function" ? update(prev) : {...prev, ...update};
      return {genFilter: next};
    }),

  learnMethodFilter: {
    "level-up": true,
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
    alphabetical: true,
    hp: false,
    attack: false,
    defense: false,
    speed: false,
    specialAttack: false,
    specialDefense: false,
    hp_defense: false,
    hp_specialDefense: false,
    hp_defense_specialDefense: false,
    attack_speed: false,
    specialAttack_speed: false,
  },
  setSortOption: (update) =>
    set((state) => {
      const prev = state.sortOption;
      const next = typeof update === "function" ? update(prev) : {...prev, ...update};
      return {sortOption: next};
    }),

  sortAscDescOption: {asc: true, desc: false},
  setSortAscDescOption: (update) =>
    set((state) => {
      const prev = state.sortAscDescOption;
      const next = typeof update === "function" ? update(prev) : {...prev, ...update};
      return {sortAscDescOption: next};
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

  isSelectingMoveForDeletionMode: false,
  setIsSelectingMoveForDeletionMode: (update) => set({isSelectingMoveForDeletionMode: update}),

  isPokemonBucketCollectingOn: false,
  setIsPokemonBucketCollectingOn: (update) => set({isPokemonBucketCollectingOn: update}),
}));
