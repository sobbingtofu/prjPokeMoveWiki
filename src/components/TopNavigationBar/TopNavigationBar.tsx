"use client";

import {useNavigateWithReset} from "@/hooks/useNavigateWithReset";
import Image from "next/image";
import Link from "next/link";
import {usePathname} from "next/navigation";
import React, {useEffect, useState} from "react";

function TopNavigationBar() {
  const path = usePathname();
  const [mounted, setMounted] = useState(false);

  const navigateWithReset = useNavigateWithReset();

  useEffect(() => {
    setMounted(true);
  }, []);

  const isActive = (href: string) => {
    if (!mounted) return false;
    // 서버/클라이언트 초기 HTML 동일하도록 마운트 전엔 항상 false로 처리
    return path === href || path?.startsWith(href);
  };

  const linkClass = (href: string) =>
    `block rounded transition-colors hover:bg-gray-700 cursor-pointer ${
      isActive(href) ? "font-bold text-white" : "text-gray-300"
    }`;

  return (
    <aside className="w-full bg-gray-800 text-white px-10 flex flex-row justify-between items-center h-[7dvh]">
      <Link href="/" className="flex flex-row items-center gap-4 py-2 cursor-pointer">
        <Image src="/ui/icon/eevee01.png" alt="Eevee Wiki Logo" width={48} height={42} />
        <h1 className="text-2xl font-bold">이브이 위키</h1>
      </Link>
      <div className="flex flex-row gap-10 text-sm py-5">
        <Link
          href="/search-learning-pokemon"
          onClick={(e) => {
            e.preventDefault();
            navigateWithReset("/search-learning-pokemon", true);
          }}
          className={linkClass("/search-learning-pokemon")}
        >
          기술을 배우는 포켓몬
        </Link>
        <Link
          href="/search-pokemon-ev"
          onClick={(e) => {
            e.preventDefault();
            navigateWithReset("/search-pokemon-ev", false);
          }}
          className={linkClass("/search-pokemon-ev")}
        >
          포켓몬이 주는 노력치
        </Link>
        <Link
          href="/search-pokemons"
          onClick={(e) => {
            e.preventDefault();
            navigateWithReset("/search-pokemons", false);
          }}
          className={linkClass("/search-pokemons")}
        >
          포켓몬
        </Link>
        <Link
          href="/search-moves"
          onClick={(e) => {
            e.preventDefault();
            navigateWithReset("/search-moves", false);
          }}
          className={linkClass("/search-moves")}
        >
          기술
        </Link>
      </div>
    </aside>
  );
}

export default TopNavigationBar;
