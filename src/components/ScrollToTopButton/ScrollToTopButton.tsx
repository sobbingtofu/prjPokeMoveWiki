import React, {useState, useEffect, useRef} from "react";

interface ScrollToTopButtonProps {
  scrollContainerRef: React.RefObject<HTMLElement>;
  durationTime?: number;
}

function ScrollToTopButton({scrollContainerRef, durationTime = 300}: ScrollToTopButtonProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;

    const toggleVisibility = () => {
      if (scrollContainer.scrollTop > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    scrollContainer.addEventListener("scroll", toggleVisibility);

    return () => {
      scrollContainer.removeEventListener("scroll", toggleVisibility);
    };
  }, [scrollContainerRef]);

  const scrollToTop = () => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;

    const startPosition = scrollContainer.scrollTop;
    const duration = durationTime; // ms
    const startTime = performance.now();

    const easeInOutQuad = (t: number) => {
      return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    };

    const animateScroll = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = easeInOutQuad(progress);

      scrollContainer.scrollTop = startPosition * (1 - ease);

      if (progress < 1) {
        requestAnimationFrame(animateScroll);
      }
    };

    requestAnimationFrame(animateScroll);
  };

  return (
    <>
      {isVisible && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-50
            bg-black
            sm:bg-gray-700 sm:hover:bg-gray-800 
            text-white rounded-full 
            w-12 h-12 flex items-center justify-center 
            shadow-lg transition-all duration-300 
            hover:scale-110 active:scale-95
            cursor-pointer
            "
          aria-label="맨 위로 이동"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </button>
      )}
    </>
  );
}

export default ScrollToTopButton;
