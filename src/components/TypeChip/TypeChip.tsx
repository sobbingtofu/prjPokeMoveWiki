import {TYPE_NAME_EN_TO_KO} from "@/store/constantStore";
import React from "react";

function TypeChip({
  type,
  korType,
  textSize,
}: {
  type: string;
  korType?: string;
  textSize?: "2xs" | "xs" | "sm" | "md" | "lg";
}) {
  const korType2 = TYPE_NAME_EN_TO_KO.find((item) => item.typeName === type)?.korTypeName || "";

  return (
    <div
      className={`sm:rounded-full rounded-lg font-bold ${textSize == "2xs" ? "w-[42px] sm:w-[65px]" : "w-[65px]"}  ${
        textSize == "2xs" ? "sm:text-xs text-[11px]" : `text-${textSize}`
      } text-center text-white bg-${type.toLowerCase()} ${textSize == "2xs" ? "px-1" : "px-2.5"} py-1.5`}
    >
      {korType ? korType : korType2 ? korType2 : type}
    </div>
  );
}

export default TypeChip;
