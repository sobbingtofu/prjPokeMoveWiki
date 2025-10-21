import {MoveCard} from "@/components/MoveCard/MoveCard";
import ScrollContainer from "@/components/ScrollContainer/ScrollContainer";
import SelectedMovesDeleteButtons from "@/components/SelectedMovesDeleteButtons/SelectedMovesDeleteButtons";
import {addLearningMethodsAndGensToPokemons, getLearningPokemonsDetail} from "@/logic/pokeapiLogics/pokeapiLogics";
import {detailedPokemInfoType} from "@/store/type";
import {useZustandStore} from "@/store/zustandStore";
import {useEffect} from "react";

interface SelectedMovesSectionProps {
  className?: string;
}

export const SelectedMovesSection = ({className = ""}: SelectedMovesSectionProps) => {
  const {
    detailedLearningPokemons_PreFilter,
    selectedMovesArrayStates,
    setLastSearchMovesArrayStates,
    setPokemonsLearningAllLastSearchMoves,
    setLoadingStates,
    setDetailedLearningPokemons_PreFilter,
    setDetailedLearningPokemons_Filtered,
    genFilter,
    learnMethodFilter,
  } = useZustandStore();

  const handleMoveCardClick = (moveId: number) => {
    console.log("해당 기술 상세보기 넘어갈 예정:", moveId);
  };

  // 필터 적용 함수
  const applyFilters = (detailedLearningPokemons_PreFilter: detailedPokemInfoType[]) => {
    const filtered = detailedLearningPokemons_PreFilter.filter((pokemon) => {
      // 각 포켓몬의 moveDetails를 순회
      const hasMatchingMove = pokemon.moveDetails?.some((moveDetail) => {
        // 해당 기술의 versionDetails를 순회
        return moveDetail.versionDetails.some((versionDetail) => {
          // 선택된 세대인지 확인
          const genKey = `gen${versionDetail.genNumber}`;
          const isGenSelected = genFilter[genKey as keyof typeof genFilter];

          // 선택된 학습 방법인지 확인
          const learnMethodKey = versionDetail.learnMethod;
          let methodKey: keyof typeof learnMethodFilter;

          if (learnMethodKey === "level-up") {
            methodKey = "level-up";
          } else if (learnMethodKey === "tutor") {
            methodKey = "tutor";
          } else if (learnMethodKey === "machine") {
            methodKey = "machine";
          } else {
            return false;
          }

          const isMethodSelected = learnMethodFilter[methodKey];

          // 세대와 학습 방법이 모두 선택되었으면 true
          return isGenSelected && isMethodSelected;
        });
      });

      return hasMatchingMove;
    });

    setDetailedLearningPokemons_Filtered(filtered);
  };

  const handleSearchButtonClick = async () => {
    // console.log(selectedMovesArrayStates);
    setLoadingStates({isMovesLearningPokemonSearchLoading: true});

    setLastSearchMovesArrayStates(selectedMovesArrayStates);

    if (selectedMovesArrayStates.length === 0) {
      setPokemonsLearningAllLastSearchMoves([]);
      setDetailedLearningPokemons_PreFilter([]);
    } else {
      const firstMoveLearners = selectedMovesArrayStates[0].learningPokemonEn;

      const commonPokemons = firstMoveLearners.filter((pokemon) => {
        // 첫 번째 기술을 배우는 포켓몬이 나머지 모든 기술도 배우는지 확인
        return selectedMovesArrayStates
          .slice(1)
          .every((move) =>
            move.learningPokemonEn.some((learner) => learner.name === pokemon.name && learner.url === pokemon.url)
          );
      });

      setPokemonsLearningAllLastSearchMoves(commonPokemons);

      const learningPokemons = await getLearningPokemonsDetail(commonPokemons);

      if (!learningPokemons) throw new Error("learningPokemons Error");

      const learningPokemonsWithMoveDetails = await addLearningMethodsAndGensToPokemons(
        learningPokemons,
        selectedMovesArrayStates
      );

      if (!learningPokemonsWithMoveDetails) throw new Error("learningPokemonsWithMoveDetails Error");

      setDetailedLearningPokemons_PreFilter(learningPokemonsWithMoveDetails);

      applyFilters(learningPokemonsWithMoveDetails);
    }

    setLoadingStates({isMovesLearningPokemonSearchLoading: false});
  };

  useEffect(() => {
    applyFilters(detailedLearningPokemons_PreFilter);
  }, [genFilter, learnMethodFilter]);

  return (
    <>
      <section className={`${className} flex flex-col items-center  `}>
        <div className="flex flex-col sm:mt-[60px] mt-[30px] w-[90%] gap-3">
          <div className="flex w-full justify-center">
            <button
              onClick={handleSearchButtonClick}
              className="w-[80%] py-4 rounded-lg bg-gray-700 hover:bg-gray-900 text-white font-black cursor-pointer"
            >
              검색 실행
            </button>
          </div>
          <div className="flex items-baseline mt-3 justify-between select-none">
            <div className="flex items-baseline ">
              <h2 className="text-2xl font-bold ">선택된 기술</h2>
              <p className="ml-2 inline-block text-sm italic text-gray-700 font-bold">{`(${selectedMovesArrayStates.length}개)`}</p>
            </div>
            <SelectedMovesDeleteButtons />
          </div>
          {selectedMovesArrayStates.length > 0 && (
            <ScrollContainer
              shouldAutoScrollOnLengthIncrease={true}
              itemsLength={selectedMovesArrayStates.length}
              className="grid xl:grid-cols-2 grid-cols-1 content-start gap-x-8 gap-y-4
              xl:min-w-[360px] min-w-[220px] sm:h-[43dvh] h-[43dvh] no-scrollbar"
            >
              {selectedMovesArrayStates.map((move) => (
                <MoveCard key={move.id} move={move} onClick={() => handleMoveCardClick(move.id)} />
              ))}
            </ScrollContainer>
          )}
        </div>
      </section>
    </>
  );
};
