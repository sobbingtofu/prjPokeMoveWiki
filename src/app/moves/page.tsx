"use client";

import {Loader} from "@/components/Loader/Loader";
import {redirect} from "next/navigation";
import {useEffect} from "react";

export default function MovesPage() {
  useEffect(() => {
    setTimeout(() => {
      redirect("/search-moves");
    }, 500);
  }, []);

  return (
    <div className="w-screen h-screen flex justify-center items-center bg-gray-200">
      <Loader />
    </div>
  );
}
