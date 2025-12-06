export const getCustomTailwindByType = (type: string, target: "text") => {
  if (target === "text") {
    return "text-" + type.toLowerCase();
  }
};
