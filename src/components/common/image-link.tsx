import { type Url } from "next/dist/shared/lib/router/router";
import Image, { type ImageProps } from "next/image";
import Link from "next/link";
import { type ComponentPropsWithoutRef } from "react";

type ImageLinkProps = {
  href: Url;
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  linkProps?: Omit<ComponentPropsWithoutRef<typeof Link>, "href" | "className">;
  imageProps?: Omit<
    ImageProps,
    "src" | "alt" | "width" | "height" | "className"
  >;
};

export const ImageLink = ({
  href,
  src,
  alt,
  width,
  height,
  className,
  linkProps = {},
  imageProps = {},
}: ImageLinkProps): React.JSX.Element => {
  return (
    <Link href={href} className={className} {...linkProps}>
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        priority={imageProps.priority ?? false}
        quality={imageProps.quality ?? 85}
        {...imageProps}
      />
    </Link>
  );
};
