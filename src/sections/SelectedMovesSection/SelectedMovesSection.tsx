import {MoveCard} from "@/components/MoveCard/MoveCard";
import ScrollContainer from "@/components/ScrollContainer/ScrollContainer";
import SelectedMovesDeleteButtons from "@/components/SelectedMovesDeleteButtons/SelectedMovesDeleteButtons";
import {addLearningMethodsAndGensToPokemons, getLearningPokemonsDetail} from "@/logic/pokeapiLogics/pokeapiLogics";
import {useZustandStore} from "@/store/zustandStore";
import {useEffect, useRef, useState} from "react";

interface SelectedMovesSectionProps {
  className?: string;
}

export const SelectedMovesSection = ({className = ""}: SelectedMovesSectionProps) => {
  const {
    selectedMovesArrayStates,
    setLastSearchMovesArrayStates,
    setPokemonsLearningAllLastSearchMoves,
    setLoadingStates,
    setDetailedLearningPokemons_PreFilter,
  } = useZustandStore();

  const handleMoveCardClick = (moveId: number) => {
    console.log("해당 기술 상세보기 넘어갈 예정:", moveId);
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
    }

    setLoadingStates({isMovesLearningPokemonSearchLoading: false});
  };

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
