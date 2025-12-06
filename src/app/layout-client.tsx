"use client";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import TopNavigationBar from "@/components/TopNavigationBar/TopNavigationBar";
import {ReactNode} from "react";

export default function RootLayoutClient({children}: {children: ReactNode}) {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex flex-col w-screen h-screen overflow-hidden">
        <TopNavigationBar />
        <main className="">{children}</main>
      </div>
    </QueryClientProvider>
  );
}
