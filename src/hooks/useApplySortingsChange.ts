import {useZustandStore} from "@/store/zustandStore";
import {useEffect} from "react";
import useApplySortings from "./useApplySortings";

const useApplySortingsChange = () => {
  const {sortOption, sortAscDescOption, detailedLearningPokemons_Filtered} = useZustandStore();

  const applySortings = useApplySortings();

  useEffect(() => {
    applySortings(detailedLearningPokemons_Filtered);
  }, [sortOption, sortAscDescOption]);
};

export default useApplySortingsChange;
