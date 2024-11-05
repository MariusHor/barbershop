import React, { useState } from "react";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/utils/helpers";
import { urlFor } from "@/lib/sanity/client";
import { type SanityImageSource } from "@sanity/image-url/lib/types/types";

interface CustomImageProps {
  src?: SanityImageSource;
  alt?: string;
  width?: number;
  height?: number;
  className?: string;
  loading?: "lazy" | "eager";
  priority?: boolean;
}

const CustomImage = ({
  src,
  width,
  height,
  className,
  alt = "",
  loading = "lazy",
  priority = false,
}: CustomImageProps) => {
  const [isImageLoading, setImageLoading] = useState(true);

  return src ? (
    <Image
      src={urlFor(src).url()}
      alt={alt}
      width={width}
      height={height}
      loading={loading}
      priority={priority}
      className={cn(
        "h-full w-full object-cover",
        isImageLoading ? "blur" : "remove-blur",
        className,
      )}
      onLoad={() => setImageLoading(false)}
    />
  ) : (
    <Skeleton className={cn("h-full w-full", className)} />
  );
};

export default CustomImage;
