import {
  getInitialMoveData,
  generateKoreanMoveData,
  addLearningMethodsAndGens,
} from "@/logic/pokeapiLogics/pokeapiLogics";
import {useZustandStore} from "@/store/zustandStore";
import {useEffect} from "react";

export const usePokemonMoveData = () => {
  const {setLoadingStates, setKoreanMovesArrayStates, setIsFirstAccessToApp, isFirstAccessToApp} = useZustandStore();
  useEffect(() => {
    if (isFirstAccessToApp) {
      const getKoreanMoveData = async () => {
        try {
          setLoadingStates({isInitialMovesLoading: true, isKoreanMovesLoading: true});

          const initialMoves = await getInitialMoveData();
          setLoadingStates({isInitialMovesLoading: false});
          if (!initialMoves) throw new Error("Initial moves data is undefined");

          const koreanMoves = await generateKoreanMoveData(initialMoves);
          setLoadingStates({isKoreanMovesLoading: false});
          if (!koreanMoves) throw new Error("Korean moves data is undefined");

          // const initialMovesWithLearningMethodsGen = await addLearningMethodsAndGens(koreanMoves);

          // console.log("Korean moves data loaded:", koreanMoves);
          // return initialMovesWithLearningMethodsGen;
          return koreanMoves;
        } catch (error) {
          console.error("데이터 로딩 실패:", error);
        }
      };

      getKoreanMoveData()
        .then((koreanMoves) => {
          if (koreanMoves) {
            console.log("데이터 로딩 성공:", koreanMoves);
            setKoreanMovesArrayStates(koreanMoves);
          } else {
            setKoreanMovesArrayStates([]);
            console.error("데이터 로딩 실패 - 빈 배열이 호출됨");
          }
        })
        .catch((error) => {
          setKoreanMovesArrayStates([]);
          console.error("데이터 로딩 실패:", error);
        })
        .finally(() => {
          setIsFirstAccessToApp(false);
        });
    }
  }, [isFirstAccessToApp, setIsFirstAccessToApp, setKoreanMovesArrayStates, setLoadingStates]);
};
