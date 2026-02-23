import {Geist, Geist_Mono, Inter} from "next/font/google";
import "./globals.css";
import {Metadata} from "next";
import RootLayoutClient from "./layout-client";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "EEVEE WIKI",
  description: "포켓몬 및 기술 정보 위키",
  icons: {
    icon: "/ui/icon/eevee01.png",
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="ko">
      <body className={`${inter.variable} font-inter`}>
        <RootLayoutClient>{children}</RootLayoutClient>
      </body>
    </html>
  );
}
