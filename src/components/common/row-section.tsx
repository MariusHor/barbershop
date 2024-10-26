import { urlFor } from "@/lib/sanity/client";
import { cn } from "@/utils/helpers";
import { type PageSection } from "@/utils/types";
import Image from "next/image";
import { Button } from "../ui/button";
import Link from "next/link";
import { ArrowRightIcon } from "@radix-ui/react-icons";
import { useState } from "react";

export const RowSection = ({
  data,
  className = "",
  reverse = false,
  maxHeight = "484px",
  titleClassName,
  imageContainerClassName,
}: {
  data: PageSection;
  className?: string;
  reverse?: boolean;
  maxHeight?: string;
  titleClassName?: string;
  imageContainerClassName?: string;
}) => {
  const [isImageLoading, setImageLoading] = useState(true);

  return (
    <section
      className={cn(
        `grid max-h-[968px] grid-rows-2 overflow-hidden border-solid border-muted-foreground lg:max-h-[${maxHeight}] lg:grid-cols-2 lg:grid-rows-1`,
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
          <h3 className="text-2xl text-dark-foreground lg:text-3xl">
            {data.subtitle}
          </h3>
        )}
        {data.content && (
          <p className="mt-4 max-w-[548px] text-lg leading-7 text-dark-foreground lg:leading-8">
            {data.content}
          </p>
        )}
        {data.linkButton?.href && (
          <Button
            size={"default"}
            variant={"ghost"}
            asChild
            className="flex gap-2 p-0 text-lg hover:bg-transparent hover:text-primary-foreground"
          >
            <Link
              href={data.linkButton.href}
              target={
                data.linkButton.href.includes("https") ? "_blank" : "_self"
              }
            >
              {data.linkButton?.text}
              <ArrowRightIcon style={{ width: "20px", height: "20px" }} />
            </Link>
          </Button>
        )}
      </div>
    </section>
  );
};
