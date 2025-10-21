import React, {useEffect, useRef, useState} from "react";

interface ScrollContainerProps {
  children: React.ReactNode;
  onScroll?: (isAtTop: boolean, isAtBottom: boolean) => void;
  className?: string;
  shouldAutoScrollOnLengthIncrease?: boolean; // 자동 스크롤 기능 사용 여부
  itemsLength?: number; // 자동 스크롤을 위한 아이템 개수
}

function ScrollContainer({
  children,
  onScroll,
  className = "",
  shouldAutoScrollOnLengthIncrease = false,
  itemsLength = 0,
}: ScrollContainerProps) {
  const [isScrolledToBottom, setIsScrolledToBottom] = useState(false);
  const [isScrolledToTop, setIsScrolledToTop] = useState(true); // 초기값은 맨 위
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const prevLengthRef = useRef(itemsLength);

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const {scrollTop, scrollHeight, clientHeight} = scrollContainerRef.current;
      const isAtBottom = scrollTop + clientHeight >= scrollHeight - 5;
      const isAtTop = scrollTop <= 5;
      setIsScrolledToTop(isAtTop);
      setIsScrolledToBottom(isAtBottom);

      if (onScroll) {
        onScroll(isAtTop, isAtBottom);
      }
    }
  };

  // 아이템 길이가 증가했을 때만 자동 스크롤
  useEffect(() => {
    if (!shouldAutoScrollOnLengthIncrease) return;

    const currentLength = itemsLength;
    const prevLength = prevLengthRef.current;

    if (currentLength > prevLength && scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: scrollContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }

    prevLengthRef.current = currentLength;
  }, [itemsLength, shouldAutoScrollOnLengthIncrease]);

  // 아이템 변경 시 스크롤 위치 업데이트
  useEffect(() => {
    handleScroll();
  }, [itemsLength]);

  return (
    <div className="relative">
      {/* 상단 그라데이션 */}
      {!isScrolledToTop && (
        <div className="absolute top-0 left-0 right-0 h-4 bg-gradient-to-b from-white to-transparent pointer-events-none z-10" />
      )}

      {/* 스크롤 컨테이너 */}
      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className={`overflow-y-scroll overflow-x-hidden  ${className}`}
      >
        {children}
      </div>

      {/* 하단 그라데이션 */}
      {!isScrolledToBottom && (
        <div className="absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-t from-white to-transparent pointer-events-none" />
      )}
    </div>
  );
}

export default ScrollContainer;
