import React, {useRef, useEffect, useState} from "react";

interface FilterOption {
  key: string;
  label: string;
}

interface FilterDropdownProps {
  title: string;
  options: FilterOption[];
  selectedOptions: {[key: string]: boolean};
  onToggle: (key: string) => void;
}

export const FilterDropdown = ({title, options, selectedOptions, onToggle}: FilterDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 외부 클릭 시 드롭다운 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div ref={dropdownRef} className="relative w-[130px]">
      {/* 필터 버튼 */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="text-white font-bold text-sm px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors w-full"
      >
        {title}
      </button>

      {/* 드롭다운 메뉴 */}
      {isOpen && (
        <div className="w-full absolute top-full left-0 mt-2 bg-gray-800 border border-gray-600 rounded-lg shadow-lg z-50">
          {options.map((option) => (
            <button
              key={option.key}
              onClick={() => {
                onToggle(option.key);
              }}
              className={`w-full text-left px-2 py-2.5 text-sm font-bold transition-colors flex justify-content items-center ${
                selectedOptions[option.key] ? "bg-cyan-700 text-white" : "bg-gray-800 text-gray-300 hover:bg-gray-700"
              }`}
            >
              <input type="checkbox" checked={selectedOptions[option.key]} readOnly className=" accent-blue-500" />
              <div className="flex justify-center items-center w-full mr-1">
                <p>{option.label}</p>
              </div>
            </button>
          ))}
          <div className="flex justify-center">
            <button
              className="my-4 bg-gray-300 rounded-lg px-6 py-2
              text-gray-900 cursor-pointer hover:bg-gray-400 transition-all duration-150 shadow-lg"
            >
              적용
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
