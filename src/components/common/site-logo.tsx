import { useMemo, type ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { api } from "@/utils/api";
import { urlFor } from "@/lib/sanity/client";
import { cn } from "@/utils/helpers";
import { ImageLink } from "./image-link";
import { Skeleton } from "../ui/skeleton";

const siteLogoVariants = cva("transition-all duration-200 block", {
  variants: {
    size: {
      sm: "max-w-[50px] sm:max-w-[60px] md:max-w-[70px]",
      md: "max-w-[60px] sm:max-w-[70px] md:max-w-[80px]",
      lg: "max-w-[70px] sm:max-w-[80px] md:max-w-[90px]",
      xl: "max-w-[80px] sm:max-w-[90px] md:max-w-[100px]",
    },
  },
  defaultVariants: {
    size: "md",
  },
});

type SiteLogoProps = VariantProps<typeof siteLogoVariants> & {
  width?: number;
  height?: number;
  className?: string;
  fallback?: ReactNode;
};

export const SiteLogo = ({
  size,
  width,
  height,
  className,
  fallback,
}: SiteLogoProps) => {
  const { data, isLoading, error } = api.content.getSiteLogo.useQuery(
    undefined,
    {
      staleTime: 1000 * 60 * 5,
      retry: 2,
    },
  );

  const siteLogoUrl = useMemo(() => {
    if (!data?.image) return null;
    return urlFor(data.image).url();
  }, [data?.image]);

  if (isLoading) {
    return <Skeleton className={cn(siteLogoVariants({ size }), className)} />;
  }

  if (error || !siteLogoUrl) {
    if (fallback) return <>{fallback}</>;
    return null;
  }

  const _width = width ?? data?.image?.width;
  const _height = height ?? data?.image?.height;

  return (
    <ImageLink
      href="/"
      src={siteLogoUrl}
      alt="website logo"
      width={_width}
      height={_height}
      linkProps={{
        "aria-label": "Catre pagina principala",
      }}
      imageProps={{ priority: true, loading: "eager" }}
      className={cn(siteLogoVariants({ size }), className)}
    />
  );
};
