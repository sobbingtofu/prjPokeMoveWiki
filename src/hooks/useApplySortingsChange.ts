import {useZustandStore} from "@/store/zustandStore";
import {useEffect} from "react";
import useApplySortings from "./useApplySortings";

const useApplySortingsChange = () => {
  const {sortOption, detailedLearningPokemons_Filtered} = useZustandStore();

  const applySortings = useApplySortings();

  useEffect(() => {
    console.log("정렬 옵션 변경 감지:", sortOption);
    applySortings(detailedLearningPokemons_Filtered);
  }, [sortOption]);
};

export default useApplySortingsChange;
