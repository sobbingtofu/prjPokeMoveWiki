import {useZustandStore} from "@/store/zustandStore";
import {useEffect} from "react";
import useApplyFilters from "./useApplyFilters";
import useApplySortings from "./useApplySortings";

const useApplyFiltersChange = () => {
  const {detailedLearningPokemons_PreFilter, genFilter, learnMethodFilter, detailedLearningPokemons_Filtered} =
    useZustandStore();
  const {setSortAscDescOption, setSortOption} = useZustandStore();

  const applyFilters = useApplyFilters();
  const applySortings = useApplySortings();
  useEffect(() => {
    applyFilters(detailedLearningPokemons_PreFilter);
    // applySortings(detailedLearningPokemons_Filtered);
  }, [genFilter, learnMethodFilter]);
};

export default useApplyFiltersChange;
