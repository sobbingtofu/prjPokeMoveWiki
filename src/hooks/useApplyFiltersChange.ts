import {useZustandStore} from "@/store/zustandStore";
import {useEffect} from "react";
import useApplyFilters from "./useApplyFilters";

const useApplyFiltersChange = () => {
  const {detailedLearningPokemons_PreFilter, genFilter, learnMethodFilter} = useZustandStore();

  const applyFilters = useApplyFilters();

  useEffect(() => {
    applyFilters(detailedLearningPokemons_PreFilter);
  }, [genFilter, learnMethodFilter]);
};

export default useApplyFiltersChange;
