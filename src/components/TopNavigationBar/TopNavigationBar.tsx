import Image from "next/image";
import Link from "next/link";
import {usePathname} from "next/navigation";
import React from "react";

function TopNavigationBar() {
  const pathname = usePathname();

  const isActive = (href: string) => pathname === href || pathname.startsWith(href);

  return (
    <aside className="w-full bg-gray-800 text-white px-10 flex flex-row justify-between items-center h-[7dvh]">
      <div className="flex flex-row items-center gap-4 py-2">
        <Image src="/ui/icon/eevee01.png" alt="Eevee Wiki Logo" width={40} height={40} />
        <h1 className="text-2xl font-bold">이브이 위키</h1>
      </div>
      <div className="flex flex-row gap-10 text-sm py-5">
        <Link
          href="/search-learning-pokemon"
          className={`block rounded transition-colors hover:bg-gray-700 ${
            isActive("/search-learning-pokemon") ? " font-bold text-white" : "text-gray-300"
          }`}
        >
          기술을 배우는 포켓몬
        </Link>
        <Link
          href="/search-pokemon-ev"
          className={`block rounded transition-colors hover:bg-gray-700 ${
            isActive("/search-pokemon-ev") ? " font-bold text-white" : "text-gray-300"
          }`}
        >
          포켓몬이 주는 노력치
        </Link>
        <Link
          href="/search/pokemons"
          className={`block rounded transition-colors hover:bg-gray-700 ${
            isActive("/search/pokemons") ? " font-bold text-white" : "text-gray-300"
          }`}
        >
          포켓몬
        </Link>
        <Link
          href="/search/moves"
          className={`block rounded transition-colors hover:bg-gray-700 ${
            isActive("/search/moves") ? " font-bold text-white" : "text-gray-300"
          }`}
        >
          기술
        </Link>
      </div>
    </aside>
  );
}

export default TopNavigationBar;
