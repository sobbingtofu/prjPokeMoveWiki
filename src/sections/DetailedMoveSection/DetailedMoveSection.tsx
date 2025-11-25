import {useZustandStore} from "@/store/zustandStore";
import React from "react";
import axios from "axios";
import {useQuery} from "@tanstack/react-query";
import {responseDataType} from "@/app/api/move-image/route";
import Image from "next/image";
import {Loader} from "@/components/Loader/Loader";

function DetailedMoveSection() {
  const {searchTargetMoveState} = useZustandStore();

  const {data: fetchImageResult, isLoading} = useQuery({
    queryKey: ["moveImage", searchTargetMoveState?.koreanName],
    queryFn: async (): Promise<responseDataType> => {
      if (!searchTargetMoveState?.koreanName) return {result: "error", data: "invalid move name received"};

      const response = await axios.get<responseDataType>("/api/move-image", {
        params: {
          moveName: searchTargetMoveState?.koreanName,
        },
      });
      return response.data;
    },
    enabled: !!searchTargetMoveState?.koreanName,
    staleTime: 1000 * 60 * 5, // 캐시 유지 5분
    retry: 3, // 재시도 3회
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  return (
    <section className="w-full flex justify-center">
      <div className="md:w-[60%] w-[80%] bg-red-400 p-4">
        {searchTargetMoveState !== null ? (
          <>
            <h2 className="text-xl font-bold mb-4">{searchTargetMoveState.koreanName}</h2>
            <div className="w-[360px] h-[240px] flex justify-center items-center relative">
              {isLoading && <Loader />}
              {fetchImageResult?.result === "success" && (
                <Image
                  src={fetchImageResult.data}
                  alt={searchTargetMoveState.koreanName}
                  fill
                  className="object-cover"
                />
              )}
            </div>
          </>
        ) : (
          "선택된 기술 없음"
        )}
      </div>
    </section>
  );
}

export default DetailedMoveSection;
