import React, { useState } from "react";
import Image from "next/image";
import { type SanityImageSource } from "@sanity/image-url/lib/types/types";
import { cn } from "@/utils/helpers";
import { urlFor } from "@/lib/sanity/client";
import { Skeleton } from "@/components/ui/skeleton";

interface CustomImageProps {
  src?: SanityImageSource;
  alt?: string;
  width?: number;
  height?: number;
  className?: string;
  loading?: "lazy" | "eager";
  priority?: boolean;
}

export const CustomImage = ({
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
    <div className={cn("h-full w-full overflow-hidden", className)}>
      <Image
        src={urlFor(src).url()}
        alt={alt}
        width={width}
        height={height}
        loading={loading}
        priority={priority}
        className={cn(
          isImageLoading ? "blur" : "remove-blur",
          "h-full w-full object-cover",
        )}
        onLoad={() => setImageLoading(false)}
      />
    </div>
  ) : (
    <Skeleton className={cn("h-full w-full bg-black", className)} />
  );
};
