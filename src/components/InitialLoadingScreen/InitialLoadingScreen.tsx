"use client";

import {useZustandStore} from "@/store/zustandStore";
import {Loader} from "../Loader/Loader";

export const InitialLoadingScreen = () => {
  const loadingStates = useZustandStore((state) => state.loadingStates);
  return (
    <>
      {Object.values(loadingStates).some((isLoading) => isLoading) && (
        <div className="fixed inset-0 bg-black opacity-50 flex flex-col items-center justify-center z-50 gap-8">
          <Loader />

          <p className="text-lg font-semibold text-gray-100 text-center">
            {"데이터를 불러오는 중입니다. 잠시만 기다려주세요..."}
          </p>
        </div>
      )}
    </>
  );
};
