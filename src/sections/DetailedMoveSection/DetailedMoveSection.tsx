import {useZustandStore} from "@/store/zustandStore";
import React from "react";
import Image from "next/image";
import {Loader} from "@/components/Loader/Loader";
import useFetchMoveImgFromNamuWiki from "@/hooks/useFetchMoveImgFromNamuWiki";
import TypeChipContainer from "@/components/TypeChip/TypeChipContainer";
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
    <section className="w-full flex justify-center">
      <div className="md:w-[60%] w-[80%]  p-4 ">
        {searchTargetMoveState !== null ? (
          <>
            <div className="w-full flex border border-gray-600 bg-gray-100 flex-col md:flex-row h-60">
              {/* 이미지 영역 */}
              <div className="w-[360px] h-60 flex justify-center items-center relative shrink-0 bg-red-400 ">
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
                <div className="flex flex-col items-start">
                  {/* 기술명, 타입, 유형 */}
                  <div className="flex flex-row justify-start gap-x-6 items-center">
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
                <div className="grid grid-cols-6 w-[60%] mr-0 ml-auto justify-end gap-x-2 gap-y-2">
                  {moveDetailItems.map((moveDetailItem) => (
                    <div
                      key={moveDetailItem.label}
                      className={`${
                        moveDetailItem.span === 3 ? "col-span-3" : "col-span-2"
                      } flex flex-row border rounded-lg items-center text-xs`}
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
