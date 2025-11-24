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

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuContainerRef = React.useRef<HTMLDivElement>(null); // 전체 메뉴 영역을 참조

  useEffect(() => {
    setMounted(true);
  }, []);

  const isActive = (href: string) => {
    if (!mounted) return false;
    return path === href || path?.startsWith(href);
  };

  const linkClass = (href: string) =>
    `block rounded transition-colors hover:bg-gray-700 cursor-pointer max-w-[100px] lg:max-w-[200px] ${
      isActive(href) ? "font-bold text-white" : "text-gray-300"
    }`;

  const menuLinkClass = (href: string) =>
    `text-right py-2 border-b border-gray-600 text-sm  cursor-pointer ${
      isActive(href) ? "font-bold text-white-400" : "text-gray-300"
    }`;

  const onClickOpenMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const menuItems = [
    {href: "/search-learning-pokemon", label: "기술을 배우는 포켓몬", reset: true},
    {href: "/search-pokemons", label: "포켓몬", reset: false},
    {href: "/search-moves", label: "기술", reset: true},
  ];

  // 외부 클릭시 드롭다운 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuContainerRef.current && !menuContainerRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className={`${isMenuOpen ? "h-auto" : "h-[7dvh]"} transition-all duration-300`}>
      <aside className="w-full bg-gray-800 text-white px-10 flex flex-row justify-between items-center h-[7dvh] min-h-[45px] relative">
        <Link
          href="/"
          onClick={(e) => {
            e.preventDefault();
            navigateWithReset("/", true);
          }}
          className="flex flex-row items-center gap-4 py-2 cursor-pointer"
        >
          <Image src="/ui/icon/eevee01.png" alt="Eevee Wiki Logo" width={48} height={42} />
          <h1 className="text-2xl font-bold min-w-[130px]">이브이 위키</h1>
        </Link>
        <div className="flex-row gap-10 text-sm py-5 hidden sm:flex">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={(e) => {
                e.preventDefault();
                navigateWithReset(item.href, item.reset);
              }}
              className={linkClass(item.href)}
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* 메뉴 버튼과 드롭다운을 하나의 ref로 감싸기 */}
        <div ref={menuContainerRef} className="sm:hidden relative">
          <div className="block font-bold text-gray-200 text-sm cursor-pointer" onClick={onClickOpenMenu}>
            {isMenuOpen ? "메뉴닫기" : "메뉴열기"}
          </div>

          {isMenuOpen && (
            <div className="w-[240px] bg-gray-700 text-white flex flex-col gap-4 px-10 py-2 absolute z-10 right-0 top-full mt-2">
              {menuItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={(e) => {
                    e.preventDefault();
                    navigateWithReset(item.href, item.reset);
                    setIsMenuOpen(false);
                  }}
                  className={menuLinkClass(item.href)}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          )}
        </div>
      </aside>
    </div>
  );
}

export default TopNavigationBar;
