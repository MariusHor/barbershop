import { cn } from "@/utils/helpers";
import { type PageSection } from "@/utils/types";
import { useWindowSize } from "@uidotdev/usehooks";
import { useEffect, useRef, useState } from "react";
import { ArrowRightIcon } from "@radix-ui/react-icons";
import { ButtonLink } from "./button-link";

export const ColumnSection = ({
  children,
  data,
  className = "",
  titleClassName = "",
  subTitleClassName = "",
}: {
  children?: ({ width }: { width: number }) => React.ReactNode;
  data: PageSection;
  className?: string;
  titleClassName?: string;
  subTitleClassName?: string;
}) => {
  const { width, height } = useWindowSize();
  const rootEl = useRef<HTMLElement>(null);
  const [rootElHeight, setRootElHeight] = useState(0);

  useEffect(() => {
    if (!rootEl.current) return;

    setRootElHeight(parseFloat(getComputedStyle(rootEl.current).height));
  }, [rootEl, width]);

  return (
    <section
      className={cn(
        "flex min-h-screen flex-col items-center justify-center gap-16",
        className,
        {
          "py-16":
            (width && width > 1328) || (height && rootElHeight >= height),
        },
      )}
      ref={rootEl}
    >
      <div className="container-md flex flex-col items-center justify-center gap-12 text-center lg:gap-16">
        {data.title && (
          <h2
            className={cn(
              "max-w-[1024px] text-5xl font-semibold text-primary-foreground md:text-6xl lg:text-7xl",
              titleClassName,
            )}
          >
            {data.title}
          </h2>
        )}

        {data.subtitle && (
          <h3
            className={cn(
              "max-w-[1024px] text-2xl text-dark-foreground md:text-3xl lg:text-4xl",
              subTitleClassName,
            )}
          >
            {data.subtitle}
          </h3>
        )}

        {data.content && (
          <p className="max-w-[786px] text-center text-lg leading-8 text-dark-foreground lg:leading-9">
            {data.content}
          </p>
        )}

        {data.linkButton?.href && (
          <ButtonLink
            size={"default"}
            variant={"ghost"}
            className="flex gap-2 p-0 text-lg hover:bg-transparent hover:text-primary-foreground"
            href={data.linkButton?.href}
          >
            {data.linkButton?.text}
            <ArrowRightIcon style={{ width: "20px", height: "20px" }} />
          </ButtonLink>
        )}
      </div>

      {width && children?.({ width })}
    </section>
  );
};
