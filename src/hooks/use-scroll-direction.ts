import { useState, useEffect } from "react";

const useScrollDirection = (threshold = 5) => {
  const [scrollDirection, setScrollDirection] = useState<null | "up" | "down">(
    null,
  );
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [isAtTop, setIsAtTop] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.scrollY;

      setIsAtTop(currentScrollPos === 0);

      if (Math.abs(currentScrollPos - prevScrollPos) < threshold) {
        return;
      }

      const direction = currentScrollPos > prevScrollPos ? "down" : "up";
      setScrollDirection(direction);
      setPrevScrollPos(currentScrollPos);
    };

    setIsAtTop(window.scrollY === 0);

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, [prevScrollPos, threshold]);

  return {
    isScrollingDown: scrollDirection === "down",
    isScrollingUp: scrollDirection === "up",
    isAtTop,
  };
};

export default useScrollDirection;
