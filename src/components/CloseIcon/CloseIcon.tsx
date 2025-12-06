import Image from "next/image";
import {PropsWithChildren} from "react";

interface CloseIconProps {
  onClick?: () => void;
}

export const CloseIcon = ({children, onClick}: PropsWithChildren<CloseIconProps>) => {
  return (
    <div className="select-none cursor-pointer hover:text-red-500 transition-colors duration-200" onClick={onClick}>
      <Image src="/ui/icon/cancel-icon-silver.png" alt="CloseIcon" width={20} height={20} />
    </div>
  );
};
