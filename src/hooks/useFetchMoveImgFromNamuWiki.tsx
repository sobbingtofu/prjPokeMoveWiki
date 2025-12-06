import {responseDataType} from "@/app/api/move-image/route";
import {selectedMoveType} from "@/store/type";
import {useQuery} from "@tanstack/react-query";
import axios from "axios";
import React from "react";

function useFetchMoveImgFromNamuWiki(searchTargetMoveState: selectedMoveType | null) {
  const {data: fetchImageResult, isLoading} = useQuery({
    queryKey: ["moveImage", searchTargetMoveState?.koreanName],
    queryFn: async (): Promise<responseDataType> => {
      console.log("Fetching move image for:", searchTargetMoveState?.koreanName);

      if (!searchTargetMoveState?.koreanName) return {result: "error", data: "invalid move name received"};

      const response = await axios.get<responseDataType>("/api/move-image", {
        params: {
          moveName: searchTargetMoveState?.koreanName,
        },
      });

      console.log("Fetch move image response:", response.data);

      return response.data;
    },
    enabled: !!searchTargetMoveState?.koreanName,
    staleTime: 1000 * 60 * 5, // 캐시 유지 5분
    retry: 3, // 재시도 3회
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  return {fetchImageResult, isLoading};
}

export default useFetchMoveImgFromNamuWiki;
