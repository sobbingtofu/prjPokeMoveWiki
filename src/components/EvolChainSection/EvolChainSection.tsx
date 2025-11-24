import {getEvolChainData} from "@/logic/pokeapiLogics/fetchMovePokemonLogics";
import {EvolutionChainDataType, pokemonTypeEnNames} from "@/logic/pokeapiLogics/type";
import {useQuery} from "@tanstack/react-query";
import React, {useEffect} from "react";
import PokemonCardSimpler from "../PokemonCardSimpler/PokemonCardSimpler";
import {types} from "util";

interface EvolChainSectionProps {
  evolutionChainUrl: string;
  types: pokemonTypeEnNames[];
}

function EvolChainSection({evolutionChainUrl, types}: EvolChainSectionProps) {
  const {data: parsedEvolChain, isLoading: isEvolChainLoading} = useQuery<EvolutionChainDataType>({
    queryKey: ["evolutionChainUrl", evolutionChainUrl],
    queryFn: () => getEvolChainData(evolutionChainUrl!),
    staleTime: Infinity,
    gcTime: Infinity,
  });

  const [showEvolChain, setShowEvolChain] = React.useState<boolean>(true);

  const totalCount = parsedEvolChain ? parsedEvolChain.reduce((acc, item) => acc + item.chainData.length, 0) : 0;

  useEffect(() => {
    if (!isEvolChainLoading && parsedEvolChain) {
      console.log("parsedEvolChain 호출 성공");
      console.log(parsedEvolChain);

      if (totalCount > 6) {
        setShowEvolChain(false);
      }
    }
  }, [isEvolChainLoading, parsedEvolChain]);

  return (
    <div className="w-full bg-gray-900 text-white">
      {evolutionChainUrl == "" && <p className="text-gray-600 italic">진화 정보 호출 실패.</p>}
      {isEvolChainLoading && <p className="text-gray-600 italic">진화 정보 로딩 중...</p>}
      {!isEvolChainLoading && parsedEvolChain && (
        <>
          <div
            onClick={() => setShowEvolChain((prev) => !prev)}
            className={`bg-${types[0].toLowerCase()} cursor-pointer px-4 py-2 text-sm select-none w-full font-bold flex justify-center gap-x-2 items-baseline`}
          >
            <p>진화정보</p>
            <p className="">{totalCount > 6 && showEvolChain ? "▲" : totalCount > 6 && !showEvolChain ? "▼" : ""}</p>
          </div>
          {/* 체인 레벨 뿌리기 */}
          {showEvolChain && (
            <div className="flex flex-row gap-1 h-min w-full">
              {parsedEvolChain.map((item, index) => {
                return (
                  <React.Fragment key={index}>
                    <div className="flex-1 flex flex-col">
                      {item.chainData.map((chainItem, chainIndex) => {
                        return <PokemonCardSimpler key={chainIndex} chainItem={chainItem} className="flex-1" />;
                      })}
                    </div>
                    {index < parsedEvolChain.length - 1 && (
                      <div className="flex items-center justify-center font-black sm:text-lg text-sm">→</div>
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          )}

          {/* 잉여영역 */}
          {totalCount > 6 && (
            <div
              onClick={() => setShowEvolChain((prev) => !prev)}
              className="flex flex-row gap-1 min-h-[30px] cursor-pointer w-full justify-center items-center border-t border-gray-400"
            >
              <p className="text-[10px] sm:text-xs font-italic text-gray-400 select-none">
                {showEvolChain ? "클릭해서 진화 정보 접기 ▲" : "클릭해서 진화 정보 펼치기 ▼"}
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default EvolChainSection;
