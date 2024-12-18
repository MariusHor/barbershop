import { type ReactNode } from "react";
import BaseMarquee from "react-fast-marquee";
import { cn } from "@/utils/helpers";
import { Text } from "../ui/text";

interface MarqueeTextProps {
  children?: ReactNode;
  text?: string;
  className?: string;
  textClassName?: string;
  autoFill?: boolean;
  pauseOnHover?: boolean;
  speed?: number;
  direction?: "left" | "right";
  textSpacing?: string;
}

export const MarqueeText = ({
  children,
  text,
  className,
  textClassName,
  autoFill = true,
  pauseOnHover = true,
  speed = 50,
  direction = "left",
  textSpacing = "ml-40",
}: MarqueeTextProps) => {
  if (!text && !children) return null;

  return (
    <BaseMarquee
      autoFill={autoFill}
      pauseOnHover={pauseOnHover}
      speed={speed}
      direction={direction}
      className={className}
    >
      {children}
      {text && (
        <Text
          variant="body"
          className={cn(textSpacing, "!text-2xl font-black", textClassName)}
        >
          {text}
        </Text>
      )}
    </BaseMarquee>
  );
};
