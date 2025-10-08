import {PropsWithChildren} from "react";

interface LoaderProps {
  size: "small" | "medium";
  color: "blue" | "emerald" | "red" | "yellow";
}

export const Loader = ({size, color}: PropsWithChildren<LoaderProps>) => {
  const sizeNumber = size === "small" ? 5 : size === "medium" ? 10 : 0;
  return (
    <div
      className={`animate-spin rounded-full h-${sizeNumber} w-${sizeNumber} border-b-${
        size == "small" ? 2 : 4
      } border-${color}-500`}
    ></div>
  );
};
