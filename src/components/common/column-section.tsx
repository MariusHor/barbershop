import { cn } from "@/utils/helpers";
import { type PageSection } from "@/utils/types";
import { useWindowSize } from "@uidotdev/usehooks";
import { useEffect, useRef, useState } from "react";
import { ArrowRightIcon } from "@radix-ui/react-icons";
import { ButtonLink } from "./button-link";
import { Text } from "../ui/text";

export const ColumnSection = ({
  children,
  data,
  className,
}: {
  children?: ({ width }: { width: number }) => React.ReactNode;
  data: PageSection;
  className?: string;
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
        <Text variant={"h2"}>{data.title}</Text>

        <Text variant={"h2"} as="h3">
          {data.subtitle}
        </Text>

        <Text variant={"body"} className="max-w-[786px]" leading={"loose"}>
          {data.content}
        </Text>

        <ButtonLink
          variant={"ghost"}
          className="flex gap-2 p-0 text-lg hover:bg-transparent hover:text-primary-foreground"
          href={data.linkButton?.href}
        >
          {data.linkButton?.text}
          <ArrowRightIcon style={{ width: "20px", height: "20px" }} />
        </ButtonLink>
      </div>

      {width && children?.({ width })}
    </section>
  );
};
