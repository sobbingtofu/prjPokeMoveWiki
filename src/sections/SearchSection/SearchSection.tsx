"use client";

import {useEffect, useRef} from "react";
import {useZustandStore} from "@/store/zustandStore";
import {koreanMoveType} from "@/logic/pokeapiLogics/type";
import {CloseIcon} from "../../components/CloseIcon/CloseIcon";
import {Loader} from "../../components/Loader/Loader";
import {Toast} from "@/components/Toast/Toast";
import {selectedMoveType} from "@/store/type";

interface SearchSectionProps {
  className?: string;
}

export const SearchSection = ({className = ""}: SearchSectionProps) => {
  const {
    searchValue,
    setSearchValue,
    filteredMoves,
    setFilteredMoves,
    isDropdownOpen,
    setIsDropdownOpen,
    isDebouncing,
    setIsDebouncing,
    koreanMovesArrayStates,
    selectedMovesArrayStates,
    setSelectedMovesArrayStates,
    setIsToastMessageVisible,
  } = useZustandStore();

  const searchContainerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const inputValueRef = useRef<string>(""); // 실시간 입력값을 관리하는 ref

  // searchValue 변경 시 검색 결과 필터링
  useEffect(() => {
    if (searchValue.trim() === "") {
      setFilteredMoves([]);
      setIsDropdownOpen(false);
      return;
    }

    const filtered = koreanMovesArrayStates.filter((move) =>
      move.koreanName.toLowerCase().includes(searchValue.toLowerCase())
    );
    // setFilteredMoves(filtered.slice(0, 60));
    setFilteredMoves(filtered);
    setIsDropdownOpen(filtered.length > 0);
  }, [searchValue, koreanMovesArrayStates, setFilteredMoves, setIsDropdownOpen]);

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
  }, [setIsToastMessageVisible, setIsDropdownOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsToastMessageVisible(false);
    inputValueRef.current = e.target.value; // ref에 실시간 값 저장
  };

  const handleKeyDown = () => {
    setIsDebouncing(true);

    // 기존 타이머 클리어
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    // 0.2초 후 searchValue 업데이트
    debounceRef.current = setTimeout(() => {
      setSearchValue(inputValueRef.current);
      setIsDebouncing(false);
    }, 200);
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
      if (selectedMovesArrayStates.length >= 40) {
        setIsToastMessageVisible(true);
        return;
      }
      setIsToastMessageVisible(false);
      setSelectedMovesArrayStates((prev) => {
        const newMove: selectedMoveType = {
          ...move,
          isSelectedForDeletion: false,
        };
        return [...prev, newMove];
      });
    }
  };

  const handleClickCloseIcon = () => {
    setIsToastMessageVisible(false);
    inputValueRef.current = "";
    setSearchValue("");
    const inputElement = searchContainerRef.current?.querySelector("input");
    if (inputElement) {
      inputElement.value = "";
    }
  };

  return (
    <section
      className={`${className} bg-gray-300 w-full sm:h-screen h-auto flex flex-col gap-2 items-center justify-start font-bold`}
    >
      <div className="sm:min-w-[280px] min-w-[280px] w-[80%] sm:mb-0 mb-36">
        <Toast className="sm:mt-36 mt-8" />
        <p className="mt-2 w-full text-xs italic text-gray-600">배우는 포켓몬을 찾아볼 기술을 검색해 클릭</p>
        {/* Search Container = 검색창 + 드롭다운 + 검색결과없음 메시지 */}
        <div ref={searchContainerRef} className="relative mt-2">
          {/* 검색창 */}
          <div className="bg-white px-6 py-4 flex justify-between items-center shadow-sm  focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 w-full text-lg border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200">
            <input
              type="text"
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              onFocus={handleInputFocus}
              placeholder="추가할 기술 이름을 입력하세요"
              className=" w-full focus:outline-none bg-transparent"
              onBlur={(e) => {
                e.preventDefault();
              }}
            />
            {isDebouncing && <Loader size="small" color="blue" />}
            {!isDebouncing && searchValue.trim() !== "" && <CloseIcon onClick={handleClickCloseIcon} />}
          </div>

          {/* 드롭다운 결과 */}
          {isDropdownOpen && (
            <div
              onMouseDown={(e) => e.preventDefault()}
              className="sm:max-h-96 max-h-[120px] absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg  overflow-y-auto z-50"
            >
              {filteredMoves.map((move) => (
                <div
                  key={move.id}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    handleDropdownItemClick(move);
                  }}
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
          {filteredMoves.length === 0 && searchValue.trim() !== "" && !isDebouncing && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg p-4 z-50">
              <p className="text-gray-500 text-center select-none">검색 결과가 없습니다.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
