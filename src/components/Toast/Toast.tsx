import {useZustandStore} from "@/store/zustandStore";
import {PropsWithChildren} from "react";

interface ToastProps {
  className?: string;
}

const ToastContainer = ({className}: PropsWithChildren<ToastProps>) => {
  return (
    <div className={`${className} h-[18px]`}>
      <ToastItem />
    </div>
  );
};

const ToastItem = ({}: PropsWithChildren<{}>) => {
  const {isToastMessageVisible, selectedMovesArrayStates} = useZustandStore();
  return (
    <>
      {isToastMessageVisible && (
        <p className="text-red-600 text-sm">
          {selectedMovesArrayStates.length >= 40 ? "최대 40개의 기술만 선택할 수 있습니다." : "이미 선택된 기술입니다."}
        </p>
      )}
    </>
  );
};

export const Toast = ({className}: PropsWithChildren<ToastProps>) => {
  return (
    <>
      <ToastContainer className={className} />
    </>
  );
};
