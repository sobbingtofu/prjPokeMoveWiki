// useNavigateWithReset.ts
import {useRouter} from "next/navigation";
import {useZustandStore} from "@/store/zustandStore";

export const useNavigateWithReset = () => {
  const router = useRouter();

  const navigateWithReset = async (href: string, reset: boolean) => {
    if (reset) {
      await useZustandStore.getState().resetSearchState();
    }
    router.push(href);
  };

  return navigateWithReset;
};
