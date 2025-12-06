import {useZustandStore} from "@/store/zustandStore";
import {useEffect} from "react";
import useApplySortings from "./useApplySortings";

const useApplySortingsChange = () => {
  const sortOption = useZustandStore((state) => state.sortOption);
  const sortAscDescOption = useZustandStore((state) => state.sortAscDescOption);
  const detailedLearningPokemons_Filtered = useZustandStore((state) => state.detailedLearningPokemons_Filtered);

  const applySortings = useApplySortings();

  useEffect(() => {
    applySortings(detailedLearningPokemons_Filtered);
  }, [sortOption, sortAscDescOption]);
};

export default useApplySortingsChange;
