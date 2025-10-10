"use client";

import {useState, useEffect, useRef} from "react";
import {useZustandStore} from "@/store/zustandStore";
import {koreanMoveType} from "@/logic/pokeapiLogics/type";
import {CloseIcon} from "../../components/CloseIcon/CloseIcon";
import {Loader} from "../../components/Loader/Loader";
import {Toast} from "@/components/Toast/Toast";

interface SearchSectionProps {
  className?: string;
}

export const SearchSection = ({className = ""}: SearchSectionProps) => {
  const [searchValue, setSearchValue] = useState("");
  const [filteredMoves, setFilteredMoves] = useState<koreanMoveType[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isDebouncing, setIsDebouncing] = useState(false);

  const {koreanMovesArrayStates, selectedMovesArrayStates, setSelectedMovesArrayStates, setIsToastMessageVisible} =
    useZustandStore();
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  // 디바운싱 처리 및 검색 결과 필터링
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (searchValue.trim() === "") {
      setFilteredMoves([]);
      setIsDropdownOpen(false);
      setIsDebouncing(false);
      return;
    }

    setIsDebouncing(true);

    debounceRef.current = setTimeout(() => {
      const filtered = koreanMovesArrayStates.filter((move) =>
        move.koreanName.toLowerCase().includes(searchValue.toLowerCase())
      );
      setFilteredMoves(filtered.slice(0, 20));
      setIsDropdownOpen(filtered.length >= 0);
      setIsDebouncing(false);
    }, 200);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [searchValue, koreanMovesArrayStates]);

  // 외부 클릭시 드롭다운 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
        setIsToastMessageVisible(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setIsToastMessageVisible]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsToastMessageVisible(false);
    setSearchValue(e.target.value);
  };

  const handleInputFocus = () => {
    if (searchValue.trim() !== "" && filteredMoves.length > 0) {
      setIsToastMessageVisible(false);
      setIsDropdownOpen(true);
    }
  };

  const handleDropdownItemClick = (move: koreanMoveType) => {
    if (selectedMovesArrayStates.find((m) => m.id === move.id)) {
      setIsToastMessageVisible(true);
      return;
    } else {
      setIsToastMessageVisible(false);
      setSelectedMovesArrayStates((prev) => [...prev, move]);
    }
  };

  return (
    <section
      className={`${className} bg-gray-300 w-full h-screen flex flex-col gap-2 items-center justify-start font-bold`}
    >
      <div className="min-w-[360px] w-[80%]">
        <Toast className="mt-36 " />
        <p className="mt-2 w-full text-xs italic text-gray-600">기술들을 선택해 배우는 포켓몬을 찾아보세요!!</p>
        {/* Search Container = 검색창 + 드롭다운 + 검색결과없음 메시지 */}
        <div ref={searchContainerRef} className="relative">
          {/* 검색창 */}
          <div className="bg-white px-6 py-4 flex justify-between items-center shadow-sm  focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 w-full text-lg border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200">
            <input
              type="text"
              value={searchValue}
              onChange={handleInputChange}
              onFocus={handleInputFocus}
              placeholder="추가할 기술 이름을 입력하세요"
              className=" w-full focus:outline-none bg-transparent"
            />
            {isDebouncing && <Loader size="small" color="blue" />}
            {!isDebouncing && searchValue.trim() !== "" && <CloseIcon onClick={() => setSearchValue("")} />}
          </div>

          {/* 드롭다운 결과 */}
          {isDropdownOpen && filteredMoves.length >= 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-96 overflow-y-auto z-50">
              {filteredMoves.map((move) => (
                <div
                  key={move.id}
                  onClick={() => handleDropdownItemClick(move)}
                  className="px-4 py-3 cursor-pointer hover:bg-gray-100 border-b border-gray-100 last:border-b-0 transition-colors duration-150"
                >
                  <div className="flex gap-2.5 justify-between items-center">
                    <div className="flex-8 flex justify-start items-center ">
                      <p className=" text-gray-900 text-sm">{move.koreanName}</p>
                    </div>

                    <div className="w-1/12 flex justify-center items-center min-w-[40px]">
                      <p className="text-gray-500 text-sm font-bold ">
                        {move.damageClass === "physical" ? "물리" : move.damageClass === "special" ? "특수" : "변화"}
                      </p>
                    </div>
                    <div className="w-1/12 flex justify-center items-center min-w-[65px]">
                      <p
                        className={`rounded-full font-bold w-[65px] text-sm text-center text-white bg-${move.type.toLowerCase()} px-2.5 py-1.5`}
                      >
                        {move.korType}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 검색 결과 없을 시 메시지 */}
          {isDropdownOpen && filteredMoves.length === 0 && searchValue.trim() !== "" && !isDebouncing && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg p-4 z-50">
              <p className="text-gray-500 text-center">검색 결과가 없습니다.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
