import { cva, type VariantProps } from "class-variance-authority";
import Link from "next/link";

import { cn } from "@/utils/helpers";

const logoVariants = cva("logo", {
  variants: {
    variant: {},
    size: {
      small: "sm:text-xl md:text-2xl",
      medium: "sm:text-2xl md:text-3xl",
      large: "sm:text-3xl md:text-4xl",
    },
  },
  defaultVariants: {
    size: "medium",
  },
});

export type Props = {
  className?: string;
  variant?: VariantProps<typeof logoVariants>["variant"];
  size?: VariantProps<typeof logoVariants>["size"];
};

export const BaseLogo = ({
  className,
  variant,
  size,
}: Props): React.JSX.Element => {
  return (
    <Link href="/" className="w-fit">
      <h2 className={cn(className, logoVariants({ variant, size, className }))}>
        Sergiu <br /> Barbershop
      </h2>
    </Link>
  );
};
