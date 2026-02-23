import {TYPE_NAME_EN_TO_KO} from "@/store/constantStore";

function TypeChip({
  type,
  korType,
  textSize,
}: {
  type: string;
  korType?: string;
  textSize?: "2xs" | "xs" | "sm" | "md" | "lg" | "minimum";
}) {
  const korType2 = TYPE_NAME_EN_TO_KO.find((item) => item.typeName === type)?.korTypeName || "";

  return (
    <div
      className={` font-bold h-min
        ${textSize == "minimum" ? "rounded-xl" : textSize == "2xs" ? "sm:rounded-lg rounded-md" : "sm:rounded-full rounded-lg"} 
        ${textSize == "minimum" ? "w-[40px]" : textSize == "2xs" ? "w-10 sm:w-[45px]" : "w-[62px]"} 
        ${textSize == "minimum" ? "text-[10px]" : textSize == "2xs" ? "sm:text-[11px] text-[10px]" : `text-sm`}
        text-center text-white ${textSize === "minimum" ? `bg-${type.toLowerCase()} opacity-90` : `bg-${type.toLowerCase()}`}
        ${textSize == "2xs" || textSize == "minimum" ? "px-1 py-1" : "px-2.5 py-1.5"}
      `}
    >
      {korType ? korType : korType2 ? korType2 : type}
    </div>
  );
}

export default TypeChip;
