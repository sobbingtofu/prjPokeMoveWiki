import React from "react";

function TypeChip({
  type,
  korType,

  textSize,
}: {
  type: string;
  korType: string;

  textSize?: "xs" | "sm" | "md" | "lg";
}) {
  return (
    <div
      className={`rounded-full font-bold w-[65px] text-${
        textSize || "sm"
      } text-center text-white bg-${type.toLowerCase()} px-2.5 py-1.5`}
    >
      {korType}
    </div>
  );
}

export default TypeChip;
