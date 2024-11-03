import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/utils/helpers";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap font-[400] ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground hover:bg-secondary hover:text-foreground",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive-foreground hover:text-foreground",
        outline:
          "border border-muted-foreground bg-primary-foreground text-dark hover:bg-background hover:text-dark-foreground",
        secondary:
          "bg-secondary text-muted-foreground hover:bg-primary hover:text-primary-foreground",
        ghost: "text-foreground hover:text-primary !p-0",
        link: "text-foreground underline-offset-4 hover:underline hover:text-primary !p-0",
      },
      size: {
        default: "py-3 px-8 text-base md:text-lg",
        sm: "py-2 px-6 text-sm md:text-base",
        lg: "py-4 px-10 text-base md:text-lg lg:text-xl",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
