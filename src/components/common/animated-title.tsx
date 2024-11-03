import { cn } from "@/utils/helpers";
import { motion } from "framer-motion";
import { Text } from "@/components/ui/text";

interface AnimatedTitleProps {
  title?: string;
  activeIndex: number;
  onLetterClick: (index: number) => void;
}

export function AnimatedTitle({
  title,
  activeIndex,
  onLetterClick,
}: AnimatedTitleProps) {
  if (!title) return null;

  return (
    <div className="relative">
      <Text variant="h1" className="sr-only">
        {title}
      </Text>

      <motion.div
        className="flex gap-4 text-center md:gap-6 xl:gap-8"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              staggerChildren: 0.1,
            },
          },
        }}
      >
        {title.split("").map((letter, index) => (
          <motion.button
            key={`${letter}-${index}`}
            variants={{
              hidden: { y: 20, opacity: 0 },
              visible: { y: 0, opacity: 1 },
            }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onLetterClick(index)}
            className={cn(
              "relative p-0 text-6xl font-black transition-colors duration-200",
              "text-primary-foreground hover:text-primary md:text-8xl 2xl:text-9xl",
              "focus:outline-none focus-visible:ring-2",
              activeIndex === index && "text-primary",
            )}
          >
            {letter}
            {activeIndex === index && (
              <motion.span
                className="absolute bottom-0 left-0 h-1 w-full bg-primary"
                layoutId="underline"
              />
            )}
          </motion.button>
        ))}
      </motion.div>
    </div>
  );
}
