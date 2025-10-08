import {PropsWithChildren} from "react";

interface LoaderProps {
  size: "small" | "medium";
  color: "blue" | "emerald" | "red" | "yellow";
}

export const Loader = ({size, color}: PropsWithChildren<LoaderProps>) => {
  return (
    <>
      {size === "small" && <div className={`animate-spin rounded-full h-4 w-4 border-b-2 border-${color}-500`}></div>}
      {size === "medium" && (
        <div className={`animate-spin rounded-full h-10 w-10 border-b-5 border-${color}-500`}></div>
      )}
    </>
  );
};
