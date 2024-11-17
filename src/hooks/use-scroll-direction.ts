import { useEffect, useState } from "react";

export const useScrollDirection = (threshold = 5) => {
  const [scrollDirection, setScrollDirection] = useState<null | "up" | "down">(
    null,
  );
  const [prevScrollPos, setPrevScrollPos] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.scrollY;

      if (Math.abs(currentScrollPos - prevScrollPos) < threshold) {
        return;
      }

      const direction = currentScrollPos > prevScrollPos ? "down" : "up";
      setScrollDirection(direction);
      setPrevScrollPos(currentScrollPos);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, [prevScrollPos, threshold]);

  return {
    isScrollingDown: scrollDirection === "down",
    isScrollingUp: scrollDirection === "up",
  };
};
