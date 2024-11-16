import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/utils/helpers";

const textVariants = cva("text-foreground", {
  variants: {
    variant: {
      h1: "scroll-m-20 text-5xl font-black tracking-tight lg:text-7xl",
      h2: "scroll-m-20 text-4xl font-extrabold tracking-tight first:mt-0 lg:text-6xl",
      h3: "scroll-m-20 text-3xl font-semibold tracking-tight lg:text-5xl",
      h4: "scroll-m-20 text-2xl tracking-tight lg:text-4xl",
      h5: "scroll-m-20 text-xl tracking-tight lg:text-3xl",
      h6: "scroll-m-20 text-lg tracking-tight lg:text-2xl",
      body: "leading-7 font-[300] [&:not(:first-child)]:mt-6 text-base md:text-lg text-muted-foreground",
      caption: "font-[300] text-sm md:text-base text-muted-foreground",
    },
    size: {
      xs: "!text-xs",
      sm: "!text-sm",
      base: "!text-base",
      lg: "!text-lg",
      xl: "!text-xl",
      "2xl": "!text-2xl",
      "3xl": "!text-3xl",
      "4xl": "!text-4xl",
      "5xl": "!text-5xl",
    },
    weight: {
      normal: "!font-normal",
      medium: "!font-medium",
      semibold: "!font-semibold",
      bold: "!font-bold",
      extrabold: "!font-extrabold",
    },
    leading: {
      none: "!leading-none",
      tight: "!leading-tight",
      snug: "!leading-snug",
      normal: "!leading-normal",
      relaxed: "!leading-relaxed",
      loose: "!leading-loose",
    },
    tracking: {
      tighter: "!tracking-tighter",
      tight: "!tracking-tight",
      normal: "!tracking-normal",
      wide: "!tracking-wide",
      wider: "!tracking-wider",
      widest: "!tracking-widest",
    },
    align: {
      left: "!text-left",
      center: "!text-center",
      right: "!text-right",
      justify: "!text-justify",
    },
  },
});

const defaultElements = {
  h1: "h1",
  h2: "h2",
  h3: "h3",
  h4: "h4",
  h5: "h5",
  h6: "h6",
  body: "p",
  large: "p",
  small: "p",
  muted: "p",
  caption: "p",
  lead: "p",
} as const;

export interface TextProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof textVariants> {
  as?: keyof JSX.IntrinsicElements;
  children: React.ReactNode;
}

export const Text = React.forwardRef<HTMLElement, TextProps>(function Text(
  {
    variant = "body",
    size,
    weight,
    leading,
    tracking,
    align,
    as,
    children,
    className,
    ...props
  },
  ref,
) {
  const Component = as ?? defaultElements[variant!];

  if (!children) return null;

  return React.createElement(
    Component,
    {
      ref,
      className: cn(
        textVariants({
          variant,
          size,
          weight,
          leading,
          tracking,
          align,
          className,
        }),
      ),
      ...props,
    },
    children,
  );
});

// // Make sure your TextProps interface includes the proper HTML attributes
// interface TextProps extends React.HTMLAttributes<HTMLElement> {
//   variant?: "h1" | "h2" | "h3" | "h4" | "body";
//   size?: string;
//   weight?: string;
//   leading?: string;
//   tracking?: string;
//   align?: string;
//   as?: keyof JSX.IntrinsicElements;
//   children: React.ReactNode;
//   className?: string;
// }
