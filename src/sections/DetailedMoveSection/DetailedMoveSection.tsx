import {useZustandStore} from "@/store/zustandStore";
import React from "react";
import axios from "axios";
import {useQuery} from "@tanstack/react-query";
import {responseDataType} from "@/app/api/move-image/route";
import Image from "next/image";
import {Loader} from "@/components/Loader/Loader";
import useFetchMoveImgFromNamuWiki from "@/hooks/useFetchMoveImgFromNamuWiki";

function DetailedMoveSection() {
  const {searchTargetMoveState} = useZustandStore();

  const {fetchImageResult, isLoading} = useFetchMoveImgFromNamuWiki(searchTargetMoveState);

  return (
    <section className="w-full flex justify-center">
      <div className="md:w-[60%] w-[80%] bg-red-400 p-4">
        {searchTargetMoveState !== null ? (
          <>
            <h2 className="text-xl font-bold mb-4">{searchTargetMoveState.koreanName}</h2>
            <div className="w-[360px] h-60 flex justify-center items-center relative">
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
