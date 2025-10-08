"use client";

import {useZustandStore} from "@/store/zustandStore";

export const Loader = () => {
  const {loadingStates} = useZustandStore();
  return (
    <>
      {Object.values(loadingStates).some((isLoading) => isLoading) && (
        <div className="flex items-center bg-slate-400 justify-center w-full h-screen bg-red">
          <p className="rounded-lg bg-amber-400 p-4 text-lg font-semibold text-gray-800 shadow-lg">
            {loadingStates.isInitialMovesLoading
              ? "초기 기술 로딩 중..."
              : loadingStates.isKoreanMovesLoading
              ? "기술 국문 로딩 중..."
              : "모든 기술 로딩 완료"}
          </p>
        </div>
      )}
    </>
  );
};
