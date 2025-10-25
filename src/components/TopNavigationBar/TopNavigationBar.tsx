import {useNavigateWithReset} from "@/hooks/useNavigateWithReset";
import {useZustandStore} from "@/store/zustandStore";
import Image from "next/image";
import Link from "next/link";
import {usePathname, useRouter} from "next/navigation";
import React from "react";

function TopNavigationBar() {
  const router = useRouter();

  const pathname = usePathname();

  const isActive = (href: string) => pathname === href || pathname.startsWith(href);

  const navigateWithReset = useNavigateWithReset();

  return (
    <aside className="w-full bg-gray-800 text-white px-10 flex flex-row justify-between items-center h-[7dvh]">
      <div className="flex flex-row items-center gap-4 py-2">
        <Image src="/ui/icon/eevee01.png" alt="Eevee Wiki Logo" width={48} height={42} />
        <h1 className="text-2xl font-bold">이브이 위키</h1>
      </div>
      <div className="flex flex-row gap-10 text-sm py-5">
        <div
          onClick={() => navigateWithReset("/search-learning-pokemon", true)}
          className={`block rounded transition-colors hover:bg-gray-700 cursor-pointer ${
            isActive("/search-learning-pokemon") ? " font-bold text-white" : "text-gray-300"
          }`}
        >
          기술을 배우는 포켓몬
        </div>
        <div
          onClick={() => navigateWithReset("/search-pokemon-ev", false)}
          className={`block rounded transition-colors hover:bg-gray-700 cursor-pointer ${
            isActive("/search-pokemon-ev") ? " font-bold text-white" : "text-gray-300"
          }`}
        >
          포켓몬이 주는 노력치
        </div>
        <div
          onClick={() => navigateWithReset("/search-pokemons", false)}
          className={`block rounded transition-colors hover:bg-gray-700 cursor-pointer ${
            isActive("/search-pokemons") ? " font-bold text-white" : "text-gray-300"
          }`}
        >
          포켓몬
        </div>
        <div
          onClick={() => navigateWithReset("/search-moves", false)}
          className={`block rounded transition-colors hover:bg-gray-700 cursor-pointer ${
            isActive("/search-moves") ? " font-bold text-white" : "text-gray-300"
          }`}
        >
          기술
        </div>
      </div>
    </aside>
  );
}

export default TopNavigationBar;
