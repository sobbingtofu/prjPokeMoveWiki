import {useZustandStore} from "@/store/zustandStore";
import React from "react";
import Image from "next/image";
import {Loader} from "@/components/Loader/Loader";
import useFetchMoveImgFromNamuWiki from "@/hooks/useFetchMoveImgFromNamuWiki";
import TypeChip from "@/components/TypeChip/TypeChip";

function DetailedMoveSection() {
  const {searchTargetMoveState} = useZustandStore();

  const {fetchImageResult, isLoading} = useFetchMoveImgFromNamuWiki(searchTargetMoveState);

  const moveDetailItems = searchTargetMoveState
    ? [
        {label: "명중률", value: searchTargetMoveState.accuracy ? searchTargetMoveState.accuracy : "―", span: 3},
        {label: "위력", value: searchTargetMoveState.power ? searchTargetMoveState.power : "―", span: 3},
        {label: "PP", value: searchTargetMoveState.pp, span: 2},
        {label: "확률", value: searchTargetMoveState.effectChance ? searchTargetMoveState.effectChance : "―", span: 2},
        {label: "우선도", value: "+" + searchTargetMoveState.priority, span: 2},
        // {label: "대상", value: searchTargetMoveState.target === "selected-pokemon" ? "지정 대상" : ""},
      ]
    : [];

  return (
    <section className="w-full flex justify-center items-start">
      <div className="w-[80%] min-w-[360px]">
        {searchTargetMoveState !== null ? (
          <>
            <div
              className="w-full lg:min-w-[750px] min-w-[350px] px-2 py-2 border border-gray-600 bg-gray-100
              flex lg:flex-row flex-col items-center
              lg:h-[280px] h-auto
              "
            >
              {/* 이미지 영역 */}
              <div className="lg:w-[360px] w-[300px] lg:h-60 h-[200px] flex justify-center items-center relative shrink-0 bg-red-400 ">
                {isLoading && <Loader />}
                {fetchImageResult?.result === "success" && !isLoading && (
                  <Image
                    src={fetchImageResult.data}
                    alt={searchTargetMoveState.koreanName}
                    fill
                    className="object-cover"
                  />
                )}
                {fetchImageResult?.result === "error" && !isLoading && (
                  <div className="flex flex-col items-center gap-y-2">
                    <p className="text-white text-xs">이미지 로드 실패</p>
                    <p className="text-white text-xs italic">{fetchImageResult.data}</p>
                  </div>
                )}
              </div>

              {/* 기술 상세 영역 */}
              <div className="flex flex-col items-start justify-between py-6 h-full px-8 w-full">
                {/* 상단부 */}
                <div className="flex flex-col items-start w-full">
                  {/* 기술명, 타입, 유형 */}
                  <div className="flex flex-row  gap-x-6 items-center w-full sm:justify-start justify-between ">
                    <h2 className="text-xl font-bold">{searchTargetMoveState.koreanName}</h2>
                    <div className="flex items-center gap-x-2">
                      <TypeChip
                        korType={searchTargetMoveState.korType}
                        type={searchTargetMoveState.type}
                        textSize="2xs"
                      />
                      <p className="text-xs font-bold text-gray-700">
                        {searchTargetMoveState.damageClass == "physical"
                          ? "물리"
                          : searchTargetMoveState.damageClass == "special"
                          ? "특수"
                          : "변화"}
                      </p>
                    </div>
                  </div>
                  {/* 기술 설명 */}
                  <p className="mt-4 text-sm">{searchTargetMoveState.korDescription}</p>
                </div>
                {/* 하단부 */}
                <div
                  className="grid lg:grid-cols-6 lg:w-[280px] grid-cols-2 
                  w-full  mr-0 ml-auto justify-end gap-x-2 gap-y-2
                  mt-4 lg:mt-0
                  "
                >
                  {moveDetailItems.map((moveDetailItem) => (
                    <div
                      key={moveDetailItem.label}
                      className={`${
                        moveDetailItem.span === 3 ? "lg:col-span-3" : "lg:col-span-2"
                      } flex flex-row border rounded-lg items-center text-xs min-w-[90px]`}
                    >
                      <div className="bg-gray-600 rounded-l-lg text-white h-full py-1.5 px-2 min-w-[52px] flex justify-center">
                        <p className="">{moveDetailItem.label}</p>
                      </div>
                      <div className="px-3 font-bold w-full flex justify-center min-w-9">
                        <p className="">{moveDetailItem.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
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
