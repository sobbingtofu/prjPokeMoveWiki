"use client";

import {useEffect, useRef} from "react";
import {useZustandStore} from "@/store/zustandStore";
import {koreanMoveType} from "@/logic/pokeapiLogics/type";
import {CloseIcon} from "../../components/CloseIcon/CloseIcon";
import {Loader} from "../../components/Loader/Loader";
import {Toast} from "@/components/Toast/Toast";
import {selectedMoveType} from "@/store/type";
import MoveSearchDropdown from "@/components/MoveSearchDropdown/MoveSearchDropdown";
import useHandleSearchBtnClick from "@/hooks/useHandleSearchBtnClick";

interface SearchSectionProps {
  className?: string;
  smDropDownHeight: number;
  dropDownHeight: number;
}

export const SearchSection = ({className = "", smDropDownHeight, dropDownHeight}: SearchSectionProps) => {
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
  const inputValueRef = useRef<string>(""); // 실시간 입력값 관리 ref
  const accentedMoveIndexRef = useRef<number>(-1);

  const lastArrowKeyTime = useRef<number>(0); // 마지막 방향키 처리 시간
  const arrowKeyThrottleDelay = 80; // 스로틀링 딜레이

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

  const handleSearchButtonClick = useHandleSearchBtnClick();

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

  const handleEnterKeyDown = () => {
    setIsDebouncing(false);
    if (filteredMoves.length > 0 && accentedMoveIndexRef.current === -1) {
      accentedMoveIndexRef.current = 0;
    } else if (filteredMoves.length > 0 && accentedMoveIndexRef.current >= 0) {
      const accentedMove = filteredMoves[accentedMoveIndexRef.current];
      if (accentedMove) {
        handleDropdownItemClick_searchLearningPokemon(accentedMove);
        // 초기화
        // enterKeyPressedCounRef.current = 0;
      }
    }
  };

  const handleArrowKeyDown = (arrow: "ArrowDown" | "ArrowUp") => {
    setIsDebouncing(false);
    if (filteredMoves.length > 0) {
      const currentTime = Date.now();
      if (currentTime - lastArrowKeyTime.current > arrowKeyThrottleDelay) {
        if (arrow === "ArrowDown") {
          if (accentedMoveIndexRef.current < filteredMoves.length - 1) {
            accentedMoveIndexRef.current += 1;
          } else {
            accentedMoveIndexRef.current = 0;
          }
        } else if (arrow === "ArrowUp") {
          if (accentedMoveIndexRef.current > 0) {
            accentedMoveIndexRef.current -= 1;
          } else {
            accentedMoveIndexRef.current = filteredMoves.length - 1;
          }
        }

        lastArrowKeyTime.current = currentTime;
      }
    }
  };

  const handleControlEnterKeyDown = () => {
    handleSearchButtonClick();
  };

  const handleKeyDownInMoveSearchInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (e.ctrlKey) {
        accentedMoveIndexRef.current = -1;
        setIsDropdownOpen(false);
        handleControlEnterKeyDown();
      } else {
        handleEnterKeyDown();
      }
    } else if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      handleArrowKeyDown(e.key);
    } else {
      setIsDebouncing(true);
      accentedMoveIndexRef.current = -1;

      // 기존 타이머 클리어
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }

      // 0.2초 후 searchValue 업데이트
      debounceRef.current = setTimeout(() => {
        setSearchValue(inputValueRef.current);
        setIsDebouncing(false);
      }, 200);
    }
  };

  const handleInputFocus = () => {
    if (searchValue.trim() !== "" && filteredMoves.length > 0) {
      setIsToastMessageVisible(false);
      setIsDropdownOpen(true);
    }
  };

  const handleDropdownItemClick_searchLearningPokemon = (move: koreanMoveType) => {
    if (selectedMovesArrayStates.find((m) => m.id === move.id)) {
      setIsToastMessageVisible(true);
      return;
    } else {
      if (selectedMovesArrayStates.length >= 8) {
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
    <section className={`${className} bg-gray-300 w-full flex flex-col gap-2 items-center justify-start font-bold `}>
      <div className="sm:min-w-[280px] min-w-[280px] w-[80%] sm:mb-0 mb-24">
        <Toast className="sm:mt-4 mt-2" />
        <p className="mt-2 w-full text-xs italic text-gray-600">배우는 포켓몬을 찾아볼 기술을 검색해 클릭</p>
        {/* Search Container = 검색창 + 드롭다운 + 검색결과없음 메시지 */}
        <div ref={searchContainerRef} className="relative mt-2">
          {/* 검색창 */}
          <div className="bg-white px-6 py-4 flex justify-between items-center shadow-sm  focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 w-full text-lg border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200">
            <input
              type="text"
              onChange={handleInputChange}
              onKeyDown={handleKeyDownInMoveSearchInput}
              onFocus={handleInputFocus}
              placeholder="기술 이름을 입력"
              className=" w-full focus:outline-none bg-transparent"
              onBlur={(e) => {
                e.preventDefault();
              }}
            />
            {isDebouncing && <Loader />}
            {!isDebouncing && searchValue.trim() !== "" && <CloseIcon onClick={handleClickCloseIcon} />}
          </div>

          {/* 드롭다운 결과 */}
          {isDropdownOpen && (
            <MoveSearchDropdown
              dropDownHeight={dropDownHeight}
              smDropDownHeight={smDropDownHeight}
              move={filteredMoves}
              dropDownOnClick={handleDropdownItemClick_searchLearningPokemon}
              accentedMoveIndex={accentedMoveIndexRef.current}
            />
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
