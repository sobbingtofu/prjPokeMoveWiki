"use client";

import {usePokemonMoveData} from "@/hooks/useMoveDataLoader";

import {useZustandStore} from "@/store/zustandStore";

export default function Home() {
  const {loadingStates, koreanMoveStates, setKoreanMoveStates, setLoadingStates} = useZustandStore();
  usePokemonMoveData();

  return (
    <div>
      <p>
        {" "}
        {loadingStates.isInitialMovesLoading
          ? "초기 기술 로딩 중..."
          : loadingStates.isKoreanMovesLoading
          ? "기술 국문 로딩 중..."
          : "모든 기술 로딩 완료"}
      </p>
      <p>총 기술 수: {koreanMoveStates.length}</p>
      <ul>
        {koreanMoveStates.map((move) => (
          <li key={move.id}>
            {move.id}. {move.koreanName}
          </li>
        ))}
      </ul>
    </div>
  );
}
