import { urlFor } from "@/lib/sanity/client";
import { cn } from "@/utils/helpers";
import { type PageSection } from "@/utils/types";
import Image from "next/image";
import { ArrowRightIcon } from "@radix-ui/react-icons";
import { useState } from "react";
import { ButtonLink } from "./button-link";
import { Text } from "../ui/text";

export const RowSection = ({
  data,
  className,
  reverse = false,
  maxHeight = "484px",
  imageContainerClassName,
}: {
  data: PageSection;
  className?: string;
  reverse?: boolean;
  maxHeight?: string;
  imageContainerClassName?: string;
}) => {
  const [isImageLoading, setImageLoading] = useState(true);

  return (
    <section
      className={cn(
        `grid grid-rows-2 overflow-hidden border-solid border-secondary-foreground lg:max-h-[${maxHeight}] lg:grid-cols-2 lg:grid-rows-1`,
        className,
      )}
    >
      {data?.image && (
        <div
          className={cn(
            `h-full w-full border-t-[1px] border-solid border-secondary-foreground bg-black object-cover lg:max-h-[${maxHeight}] order-2 lg:border-t-0`,
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
            "border-solid border-secondary-foreground lg:border-l-[1px]":
              !reverse,
          },
        )}
      >
        <Text variant={"h2"}>{data.title}</Text>

        <Text variant={"h4"} as="h3">
          {data.subtitle}
        </Text>

        <Text variant={"body"} className="max-w-[624px]" leading={"normal"}>
          {data.content}
        </Text>

        <ButtonLink
          variant={"ghost"}
          className="flex gap-2"
          href={data.linkButton?.href}
        >
          {data.linkButton?.text}
          <ArrowRightIcon style={{ width: "20px", height: "20px" }} />
        </ButtonLink>
      </div>
    </section>
  );
};
