import {useZustandStore} from "@/store/zustandStore";
import React from "react";
import Image from "next/image";
import {Loader} from "@/components/Loader/Loader";
import useFetchMoveImgFromNamuWiki from "@/hooks/useFetchMoveImgFromNamuWiki";
import TypeChip from "@/components/TypeChip/TypeChip";
import {koreanMoveType} from "@/logic/pokeapiLogics/type";
import {selectedMoveType} from "@/store/type";

interface DetailedMoveSectionProps {
  currentMove: selectedMoveType;
}

function DetailedMoveSection({currentMove}: DetailedMoveSectionProps) {
  const {fetchImageResult, isLoading} = useFetchMoveImgFromNamuWiki(currentMove);

  const moveDetailItems = currentMove
    ? [
        {label: "명중률", value: currentMove.accuracy ? currentMove.accuracy : "―", span: 3},
        {label: "위력", value: currentMove.power ? currentMove.power : "―", span: 3},
        {label: "PP", value: currentMove.pp, span: 2},
        {label: "확률", value: currentMove.effectChance ? currentMove.effectChance : "―", span: 2},
        {label: "우선도", value: "+" + currentMove.priority, span: 2},
        // {label: "대상", value: currentMove.target === "selected-pokemon" ? "지정 대상" : ""},
      ]
    : [];

  return (
    <section className="w-full flex justify-center items-start">
      <div className="w-[70%] min-w-[360px]">
        {currentMove !== null ? (
          <>
            <div
              className="w-full lg:min-w-[710px] min-w-[350px] px-10 lg:pt-2 pt-8 lg:pb-2 pb-2
              border border-gray-600 bg-gray-100 rounded-lg shadow-sm
              flex lg:flex-row flex-col items-center
              lg:h-80 h-auto
              "
            >
              {/* 이미지 영역 */}
              <div className="lg:w-[360px] w-[300px] lg:h-60 h-[200px] flex justify-center items-center relative shrink-0 bg-gray-400 ">
                {isLoading && <Loader />}
                {fetchImageResult?.result === "success" && !isLoading && (
                  <Image src={fetchImageResult.data} alt={currentMove.koreanName} fill className="object-cover" />
                )}
                {fetchImageResult?.result === "error" && !isLoading && (
                  <div className="flex flex-col items-center gap-y-2">
                    <p className="text-white text-xs">이미지 로드 실패</p>
                    <p className="text-white text-xs italic">{fetchImageResult.data}</p>
                  </div>
                )}
              </div>

              {/* 기술 상세 영역 */}
              <div className="flex flex-col items-start justify-between py-6 h-full xl:pl-8 pl-4 min-w-[300px] w-full">
                {/* 상단부 */}
                <div className="flex flex-col items-start w-full">
                  {/* 기술명, 타입, 유형 */}
                  <div className="flex flex-row  gap-x-6 items-center w-full sm:justify-start justify-between ">
                    <h2 className="text-xl font-bold">{currentMove.koreanName}</h2>
                    <div className="flex items-center gap-x-2">
                      <TypeChip korType={currentMove.korType} type={currentMove.type} textSize="2xs" />
                      <p className="text-xs font-bold text-gray-700">
                        {currentMove.damageClass == "physical"
                          ? "물리"
                          : currentMove.damageClass == "special"
                          ? "특수"
                          : "변화"}
                      </p>
                    </div>
                  </div>
                  {/* 기술 설명 */}
                  <p className="mt-4 text-sm">{currentMove.korDescription}</p>
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
