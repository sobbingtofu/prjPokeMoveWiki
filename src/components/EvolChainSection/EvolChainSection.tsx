import {getEvolChainData} from "@/logic/pokeapiLogics/fetchMovePokemonLogics";
import {useQuery} from "@tanstack/react-query";
import React, {useEffect} from "react";

interface EvolChainSectionProps {
  evolutionChainUrl: string;
}

function EvolChainSection({evolutionChainUrl}: EvolChainSectionProps) {
  const {data: parsedEvolChain, isLoading: isEvolChainLoading} = useQuery({
    queryKey: ["evolutionChainUrl", evolutionChainUrl],
    queryFn: () => getEvolChainData(evolutionChainUrl!),
    staleTime: Infinity,
    gcTime: Infinity,
  });

  useEffect(() => {
    if (!isEvolChainLoading && parsedEvolChain) {
      console.log("parsedEvolChain 호출 성공");
      console.log(parsedEvolChain);
    }
  }, [isEvolChainLoading, parsedEvolChain]);

  return (
    <div className="w-full">
      {evolutionChainUrl == "" && <p className="text-gray-600 italic">진화 정보 호출 실패.</p>}
      {isEvolChainLoading && <p className="text-gray-600 italic">진화 정보 로딩 중...</p>}
      {!isEvolChainLoading && parsedEvolChain && (
        <>
          <p>진화 정보 로딩 성공</p>
          <div>
            {parsedEvolChain.map((item, index) => {
              return (
                <div key={index}>
                  {item.chainLevel} {item.name} {item.url}
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

export default EvolChainSection;
