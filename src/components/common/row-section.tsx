import { urlFor } from "@/lib/sanity/client";
import { cn } from "@/utils/helpers";
import { type PageSection } from "@/utils/types";
import Image from "next/image";
import { ArrowRightIcon } from "@radix-ui/react-icons";
import { useState } from "react";
import { ButtonLink } from "./button-link";

export const RowSection = ({
  data,
  className = "",
  reverse = false,
  maxHeight = "484px",
  titleClassName,
  subtitleClassName,
  contentClassName,
  imageContainerClassName,
}: {
  data: PageSection;
  className?: string;
  reverse?: boolean;
  maxHeight?: string;
  titleClassName?: string;
  subtitleClassName?: string;
  contentClassName?: string;
  imageContainerClassName?: string;
}) => {
  const [isImageLoading, setImageLoading] = useState(true);

  return (
    <section
      className={cn(
        `grid grid-rows-2 overflow-hidden border-solid border-muted-foreground lg:max-h-[${maxHeight}] lg:grid-cols-2 lg:grid-rows-1`,
        className,
      )}
    >
      {data?.image && (
        <div
          className={cn(
            `h-full w-full border-t-[1px] border-solid border-muted-foreground bg-black object-cover lg:max-h-[${maxHeight}] order-2 lg:border-t-0`,
            {
              "lg:border-l-[1px]": reverse,
              "lg:order-[0]": !reverse,
            },
            imageContainerClassName,
          )}
        >
          <Image
            src={urlFor(data.image).url()}
            alt={
              data.image.alt ??
              `Image representing the ${data.title?.toLowerCase()}`
            }
            width={data.image.width}
            height={data.image.height}
            loading="lazy"
            className={cn(
              "h-full w-full object-cover",
              `${isImageLoading ? "blur" : "remove-blur"}`,
            )}
            onLoad={() => setImageLoading(false)}
          />
        </div>
      )}

      <div
        className={cn(
          "container-md flex flex-col items-center justify-center gap-6 py-24 text-center text-dark lg:items-start lg:px-12 lg:text-left",
          {
            "border-solid border-muted-foreground lg:border-l-[1px]": !reverse,
          },
        )}
      >
        {data.title && (
          <h2 className={cn("text-3xl text-dark lg:text-4xl", titleClassName)}>
            {data.title}
          </h2>
        )}
        {data.subtitle && (
          <h3
            className={cn(
              "text-base text-dark-foreground md:text-lg xl:text-xl",
              subtitleClassName,
            )}
          >
            {data.subtitle}
          </h3>
        )}
        {data.content && (
          <p
            className={cn(
              "mt-4 max-w-[548px] text-lg leading-7 text-dark-foreground lg:leading-8",
              contentClassName,
            )}
          >
            {data.content}
          </p>
        )}
        {data.linkButton?.href && (
          <ButtonLink
            variant={"ghost"}
            className="flex gap-2"
            href={data.linkButton.href}
          >
            {data.linkButton?.text}
            <ArrowRightIcon style={{ width: "20px", height: "20px" }} />
          </ButtonLink>
        )}
      </div>
    </section>
  );
};
