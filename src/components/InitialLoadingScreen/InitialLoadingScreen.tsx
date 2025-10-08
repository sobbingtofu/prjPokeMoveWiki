"use client";

import {useZustandStore} from "@/store/zustandStore";
import {Loader} from "../Loader/Loader";

export const InitialLoadingScreen = () => {
  const {loadingStates} = useZustandStore();
  return (
    <>
      {Object.values(loadingStates).some((isLoading) => isLoading) && (
        <div className="fixed inset-0 bg-black opacity-50 flex flex-col items-center justify-center z-50 gap-8">
          <Loader size="medium" color="emerald" />

          <p className="text-lg font-semibold text-gray-100 text-center">
            {loadingStates.isInitialMovesLoading
              ? // ? "초기 기술 로딩 중..."
                "필요 데이터 구성 중..."
              : loadingStates.isKoreanMovesLoading
              ? // ? "기술 국문 로딩 중..."
                "필요 데이터 구성 중..."
              : "모든 기술 로딩 완료"}
          </p>
        </div>
      )}
    </>
  );
};
