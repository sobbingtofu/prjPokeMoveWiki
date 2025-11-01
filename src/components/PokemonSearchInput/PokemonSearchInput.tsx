import React, {useRef, useState} from "react";
import {CloseIcon} from "../CloseIcon/CloseIcon";
import {Loader} from "../Loader/Loader";

function PokemonSearchInput() {
  const [isDebouncing, setIsDebouncing] = useState(false);

  const [searchValue, setSearchValue] = useState("");

  const inputValueRef = useRef<string>(""); // 실시간 입력값 관리 ref

  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    inputValueRef.current = e.target.value; // ref에 실시간 값 저장
  };

  const handleKeyDownSearchInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
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

  const handleClickCloseIcon = () => {
    inputValueRef.current = "";
    setSearchValue("");
    const inputElement = searchContainerRef.current?.querySelector("input");
    if (inputElement) {
      inputElement.value = "";
    }
  };
  return (
    <div
      className="bg-white px-6 py-4 flex justify-between items-center shadow-sm
                 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500
                 w-full text-lg border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500
                 focus:ring-2 focus:ring-blue-200 transition-all duration-200
                 overflow-hidden"
      ref={searchContainerRef}
    >
      <input
        autoFocus
        type="text"
        onChange={handleInputChange}
        onKeyDown={handleKeyDownSearchInput}
        placeholder="포켓몬의 이름을 입력"
        className=" w-full focus:outline-none bg-transparent"
        onBlur={(e) => {
          e.preventDefault();
        }}
      />
      {isDebouncing && <Loader />}
      {!isDebouncing && searchValue.trim() !== "" && <CloseIcon onClick={handleClickCloseIcon} />}
    </div>
  );
}

export default PokemonSearchInput;
