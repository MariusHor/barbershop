import { useEffect, useState } from "react";

type ScrollPositionProps = {
  threshold?: number;
};

export const useScrollPosition = ({
  threshold = 200,
}: ScrollPositionProps = {}) => {
  const [isAtTop, setIsAtTop] = useState(true);
  const [isAtBottom, setIsAtBottom] = useState(false);
  const [isAboveThreshold, setIsAboveThreshold] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const isTop = currentScrollY === 0;

      const isPastThreshold = currentScrollY > threshold;

      const isBottom =
        window.innerHeight + Math.round(currentScrollY) >=
        document.documentElement.scrollHeight;

      setIsAtTop(isTop);
      setIsAtBottom(isBottom);
      setIsAboveThreshold(isPastThreshold);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [threshold]);

  return {
    isAtTop,
    isAtBottom,
    isAboveThreshold,
  };
};
