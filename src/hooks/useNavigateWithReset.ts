// useNavigateWithReset.ts
import {usePathname, useRouter} from "next/navigation";
import {useZustandStore} from "@/store/zustandStore";

export const useNavigateWithReset = () => {
  const router = useRouter();
  const pathname = usePathname();

  const navigateWithReset = async (href: string, reset: boolean) => {
    const targetPath = href;

    if (reset) {
      useZustandStore.getState().resetSearchState();

      if (pathname === targetPath) {
        window.location.href = targetPath;
      } else {
        router.push(targetPath);
      }
    } else {
      if (pathname === targetPath) {
        router.refresh();
      } else {
        router.push(targetPath);
      }
    }
  };

  return navigateWithReset;
};
