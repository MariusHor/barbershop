import { forwardRef } from "react";
import { cn } from "@/utils/helpers";

const containerSizes = {
  "1": "max-w-screen-sm", // 640px
  "2": "max-w-screen-md", // 768px
  "3": "max-w-screen-lg", // 1024px
  "4": "max-w-screen-xl", // 1280px
  "5": "max-w-screen-2xl", // 1536px
} as const;

const spaceScale = {
  "1": "gap-1 p-1", // 0.25rem, 4px
  "2": "gap-2 p-2", // 0.5rem, 8px
  "3": "gap-4 p-4", // 1rem, 16px
  "4": "gap-6 p-6", // 1.5rem, 24px
  "5": "gap-8 p-8", // 2rem, 32px
  "6": "gap-12 p-12", // 3rem, 48px
  "7": "gap-16 p-16", // 4rem, 64px
} as const;

interface BaseProps extends React.HTMLAttributes<HTMLElement> {
  as?: React.ElementType;
}

interface ContainerProps extends BaseProps {
  size?: keyof typeof containerSizes;
  centered?: boolean;
  gutter?: boolean;
  heightFull?: boolean;
  heightScreen?: boolean;
}

export const Container = forwardRef<HTMLElement, ContainerProps>(
  (
    {
      as: Component = "div",
      size = "3",
      centered = true,
      gutter = true,
      heightFull = false,
      heightScreen = false,
      className,
      ...props
    },
    ref,
  ) => {
    return (
      <Component
        ref={ref}
        className={cn(
          { "h-full": heightFull, "h-screen": heightScreen },
          containerSizes[size],
          centered && "mx-auto",
          gutter && "px-4 sm:px-6 lg:px-8",
          className,
        )}
        {...props}
      />
    );
  },
);
Container.displayName = "Container";

interface SectionProps extends BaseProps {
  spacing?: keyof typeof spaceScale;
  heightFull?: boolean;
  heightScreen?: boolean;
}

export const Section = forwardRef<HTMLElement, SectionProps>(
  (
    {
      as: Component = "section",
      heightFull = false,
      heightScreen = false,
      spacing,
      className,
      children,
      ...props
    },
    ref,
  ) => {
    return (
      <Component
        ref={ref}
        className={cn(
          { "h-full": heightFull, "h-screen": heightScreen },
          spacing && spaceScale[spacing],
          className,
        )}
        {...props}
      >
        {children}
      </Component>
    );
  },
);
Section.displayName = "Section";

const gridColsMap = {
  1: "grid-cols-1",
  2: "grid-cols-2",
  3: "grid-cols-3",
  4: "grid-cols-4",
  5: "grid-cols-5",
  6: "grid-cols-6",
  7: "grid-cols-7",
  8: "grid-cols-8",
  9: "grid-cols-9",
  10: "grid-cols-10",
  11: "grid-cols-11",
  12: "grid-cols-12",
} as const;

const responsiveGridColsMap = {
  sm: {
    1: "sm:grid-cols-1",
    2: "sm:grid-cols-2",
    3: "sm:grid-cols-3",
    4: "sm:grid-cols-4",
    5: "sm:grid-cols-5",
    6: "sm:grid-cols-6",
    7: "sm:grid-cols-7",
    8: "sm:grid-cols-8",
    9: "sm:grid-cols-9",
    10: "sm:grid-cols-10",
    11: "sm:grid-cols-11",
    12: "sm:grid-cols-12",
  },
  md: {
    1: "md:grid-cols-1",
    2: "md:grid-cols-2",
    3: "md:grid-cols-3",
    4: "md:grid-cols-4",
    5: "md:grid-cols-5",
    6: "md:grid-cols-6",
    7: "md:grid-cols-7",
    8: "md:grid-cols-8",
    9: "md:grid-cols-9",
    10: "md:grid-cols-10",
    11: "md:grid-cols-11",
    12: "md:grid-cols-12",
  },
  lg: {
    1: "lg:grid-cols-1",
    2: "lg:grid-cols-2",
    3: "lg:grid-cols-3",
    4: "lg:grid-cols-4",
    5: "lg:grid-cols-5",
    6: "lg:grid-cols-6",
    7: "lg:grid-cols-7",
    8: "lg:grid-cols-8",
    9: "lg:grid-cols-9",
    10: "lg:grid-cols-10",
    11: "lg:grid-cols-11",
    12: "lg:grid-cols-12",
  },
  xl: {
    1: "xl:grid-cols-1",
    2: "xl:grid-cols-2",
    3: "xl:grid-cols-3",
    4: "xl:grid-cols-4",
    5: "xl:grid-cols-5",
    6: "xl:grid-cols-6",
    7: "xl:grid-cols-7",
    8: "xl:grid-cols-8",
    9: "xl:grid-cols-9",
    10: "xl:grid-cols-10",
    11: "xl:grid-cols-11",
    12: "xl:grid-cols-12",
  },
  "2xl": {
    1: "2xl:grid-cols-1",
    2: "2xl:grid-cols-2",
    3: "2xl:grid-cols-3",
    4: "2xl:grid-cols-4",
    5: "2xl:grid-cols-5",
    6: "2xl:grid-cols-6",
    7: "2xl:grid-cols-7",
    8: "2xl:grid-cols-8",
    9: "2xl:grid-cols-9",
    10: "2xl:grid-cols-10",
    11: "2xl:grid-cols-11",
    12: "2xl:grid-cols-12",
  },
} as const;

const itemsClasses = {
  start: "items-start",
  end: "items-end",
  center: "items-center",
  baseline: "items-baseline",
  stretch: "items-stretch",
} as const;

const justifyClasses = {
  start: "justify-start",
  end: "justify-end",
  center: "justify-center",
  between: "justify-between",
  around: "justify-around",
  evenly: "justify-evenly",
} as const;

interface ResponsiveCols {
  base?: 1 | 2 | 3 | 4 | 5 | 6 | 12;
  sm?: 1 | 2 | 3 | 4 | 5 | 6 | 12;
  md?: 1 | 2 | 3 | 4 | 5 | 6 | 12;
  lg?: 1 | 2 | 3 | 4 | 5 | 6 | 12;
  xl?: 1 | 2 | 3 | 4 | 5 | 6 | 12;
  "2xl"?: 1 | 2 | 3 | 4 | 5 | 6 | 12;
}

interface GridProps extends BaseProps {
  cols?: ResponsiveCols | (1 | 2 | 3 | 4 | 5 | 6 | 12);
  gap?: keyof typeof spaceScale;
  items?: "start" | "center" | "end" | "stretch";
  justify?: "start" | "center" | "end" | "between";
  heightFull?: boolean;
  heightScreen?: boolean;
}

export const Grid = forwardRef<HTMLElement, GridProps>(
  (
    {
      as: Component = "div",
      cols = 1,
      heightFull = false,
      heightScreen = false,
      gap,
      items,
      justify,
      className,
      ...props
    },
    ref,
  ) => {
    const getResponsiveCols = () => {
      if (typeof cols === "number") {
        return gridColsMap[cols];
      }

      return cn(
        cols.base && gridColsMap[cols.base],
        cols.sm && responsiveGridColsMap.sm[cols.sm],
        cols.md && responsiveGridColsMap.md[cols.md],
        cols.lg && responsiveGridColsMap.lg[cols.lg],
        cols.xl && responsiveGridColsMap.xl[cols.xl],
        cols["2xl"] && responsiveGridColsMap["2xl"][cols["2xl"]],
      );
    };

    return (
      <Component
        ref={ref}
        className={cn(
          "grid",
          { "h-full": heightFull, "h-screen": heightScreen },
          getResponsiveCols(),
          gap && spaceScale[gap].split(" ")[0],
          items && itemsClasses[items],
          justify && justifyClasses[justify],
          className,
        )}
        {...props}
      />
    );
  },
);
Grid.displayName = "Grid";

interface FlexProps extends BaseProps {
  direction?: "row" | "col";
  wrap?: boolean;
  gap?: keyof typeof spaceScale;
  items?: "start" | "center" | "end" | "stretch" | "baseline";
  justify?: "start" | "center" | "end" | "between" | "around" | "evenly";
  inline?: boolean;
  heightFull?: boolean;
  heightScreen?: boolean;
}

export const Flex = forwardRef<HTMLElement, FlexProps>(
  (
    {
      as: Component = "div",
      direction = "row",
      wrap = false,
      inline = false,
      heightFull = false,
      heightScreen = false,
      gap,
      items,
      justify,
      className,
      ...props
    },
    ref,
  ) => {
    return (
      <Component
        ref={ref}
        className={cn(
          {
            "h-full": heightFull,
            "h-screen": heightScreen,
          },
          inline ? "inline-flex" : "flex",
          direction === "col" && "flex-col",
          wrap && "flex-wrap",
          gap && spaceScale[gap].split(" ")[0],
          items && itemsClasses[items],
          justify && justifyClasses[justify],
          className,
        )}
        {...props}
      />
    );
  },
);
Flex.displayName = "Flex";
