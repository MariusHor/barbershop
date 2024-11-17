import { ArrowUpIcon } from "@radix-ui/react-icons";
import { cn } from "@/utils/helpers";
import { Button } from "@/components/ui/button";
import { useScrollPosition } from "@/hooks/use-scroll-position";

export const BackToTopBtn = () => {
  const { isAboveThreshold } = useScrollPosition({ threshold: 200 });

  function handleScrollTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <Button
      variant="outline"
      className={cn(
        "fixed bottom-4 left-4 z-40 h-[48px] w-[48px] rounded-full border-border p-2 shadow-xl md:h-[54px] md:w-[54px] lg:h-[64px] lg:w-[64px]",
        "transform transition duration-300 ease-in-out",
        {
          "-translate-x-20 opacity-0": !isAboveThreshold,
          "translate-x-0 opacity-100": isAboveThreshold,
        },
      )}
      onClick={handleScrollTop}
    >
      <ArrowUpIcon className="h-5 w-5 lg:h-7 lg:w-7" />
    </Button>
  );
};
