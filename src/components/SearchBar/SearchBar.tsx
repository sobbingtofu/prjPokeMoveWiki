"use client";

import {useState, useEffect, useRef} from "react";
import {useZustandStore} from "@/store/zustandStore";
import {koreanMoveType} from "@/logic/pokeapiLogics/type";

export const SearchBar = () => {
  const [searchValue, setSearchValue] = useState("");
  const [filteredMoves, setFilteredMoves] = useState<koreanMoveType[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isDebouncing, setIsDebouncing] = useState(false);

  const {koreanMoveStates} = useZustandStore();
  const searchRef = useRef<HTMLDivElement>(null);
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
      const filtered = koreanMoveStates.filter((move) =>
        move.koreanName.toLowerCase().includes(searchValue.toLowerCase())
      );
      setFilteredMoves(filtered.slice(0, 10)); // 최대 10개까지만 표시
      setIsDropdownOpen(filtered.length > 0);
      setIsDebouncing(false);
    }, 500);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [searchValue, koreanMoveStates]);

  // 외부 클릭시 드롭다운 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  const handleMoveSelect = (move: koreanMoveType) => {
    setSearchValue(move.koreanName);
    setIsDropdownOpen(false);
    // 여기에 선택된 기술에 대한 추가 처리 로직을 넣을 수 있습니다.
  };

  return (
    <div className="w-screen h-screen flex flex-col items-center mt-24">
      <div ref={searchRef} className="relative w-full max-w-md mx-4">
        {/* 검색 바 */}
        <div className="">
          <input
            type="text"
            value={searchValue}
            onChange={handleInputChange}
            placeholder="기술 이름을 검색하세요..."
            className="shadow-sm focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
          />

          {/* 로딩 인디케이터 */}
          {isDebouncing && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
            </div>
          )}
        </div>

        {/* 드롭다운 결과 */}
        {isDropdownOpen && filteredMoves.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-80 overflow-y-auto z-50">
            {filteredMoves.map((move) => (
              <div
                key={move.id}
                onClick={() => handleMoveSelect(move)}
                className="px-4 py-3 cursor-pointer hover:bg-gray-100 border-b border-gray-100 last:border-b-0 transition-colors duration-150"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium text-gray-900">{move.koreanName}</p>
                    <p className="text-sm text-gray-500">{move.name}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 text-xs rounded-full text-white bg-${move.type}-500`}>{move.type}</span>
                    <span
                      className={`px-2 py-1 text-xs rounded-full text-white ${
                        move.damageClass === "physical"
                          ? "bg-red-500"
                          : move.damageClass === "special"
                          ? "bg-blue-500"
                          : "bg-gray-500"
                      }`}
                    >
                      {move.damageClass}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 검색 결과 없음 */}
        {isDropdownOpen && filteredMoves.length === 0 && searchValue.trim() !== "" && !isDebouncing && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg p-4 z-50">
            <p className="text-gray-500 text-center">검색 결과가 없습니다.</p>
          </div>
        )}
      </div>
    </div>
  );
};
