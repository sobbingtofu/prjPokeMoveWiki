"use client";

import {getInitialMoveData, generateKoreanMoveData, getKoreanMoveData} from "@/logic/pokeapiLogics";
import {useEffect, useState} from "react";

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoaded(false); // 로딩 시작
        await getKoreanMoveData();
        setIsLoaded(true); // 로딩 완료
      } catch (error) {
        console.error("데이터 로딩 실패:", error);
        setIsLoaded(false); // 에러 시 false 유지
      }
    };

    fetchData();
  }, []);

  return <div>홈페이지 테스트</div>;
}
