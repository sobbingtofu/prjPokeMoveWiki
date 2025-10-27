import {useZustandStore} from "@/store/zustandStore";
import {useEffect} from "react";
import useApplyFilters from "./useApplyFilters";

const useApplyFiltersChange = () => {
  const detailedLearningPokemons_PreFilter = useZustandStore((state) => state.detailedLearningPokemons_PreFilter);
  const genFilter = useZustandStore((state) => state.genFilter);
  const learnMethodFilter = useZustandStore((state) => state.learnMethodFilter);

  const applyFilters = useApplyFilters();

  useEffect(() => {
    applyFilters(detailedLearningPokemons_PreFilter);
    // applySortings(detailedLearningPokemons_Filtered);
  }, [genFilter, learnMethodFilter]);
};

export default useApplyFiltersChange;
