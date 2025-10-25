"use client";
import {Geist, Geist_Mono} from "next/font/google";
import "./globals.css";
import Link from "next/link";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const queryClient = new QueryClient();

  return (
    <html lang="en">
      <QueryClientProvider client={queryClient}>
        <body className={`${geistSans.variable} ${geistMono.variable}`}>
          <div className="flex flex-col w-screen h-screen overflow-hidden">
            <aside className="w-full bg-gray-800 text-white px-10 py-5 flex flex-row justify-between ">
              <div></div>
              <div className="flex flex-row gap-6 text-md font-bold">
                <Link href="/search-learning-pokemon" className="block  hover:bg-gray-700 rounded">
                  기술을 배우는 포켓몬 찾기
                </Link>
                <Link href="/search/pokemons" className="block  hover:bg-gray-700 rounded">
                  메뉴 2
                </Link>
                <Link href="/search/favorites" className="block  hover:bg-gray-700 rounded">
                  메뉴 3
                </Link>
              </div>
            </aside>
            <main className="">{children}</main>
          </div>
        </body>
      </QueryClientProvider>
    </html>
  );
}

export default RootLayout;
