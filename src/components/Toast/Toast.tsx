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
  const {isToastMessageVisible} = useZustandStore();
  return <>{isToastMessageVisible && <p className="text-red-600 text-sm">이미 선택된 기술입니다.</p>}</>;
};

export const Toast = ({className}: PropsWithChildren<ToastProps>) => {
  return (
    <>
      <ToastContainer className={className} />
    </>
  );
};
