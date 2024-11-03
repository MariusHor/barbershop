import { type Url } from "next/dist/shared/lib/router/router";
import Image from "next/image";
import Link from "next/link";

type Props = {
  width?: number;
  height?: number;
  className?: string;
  href: Url;
  src: string;
  alt: string;
};

export const ImageLink = ({
  width,
  height,
  href,
  src,
  alt,
  className,
}: Props): React.JSX.Element => {
  return (
    <Link href={href}>
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={className}
        priority
      />
    </Link>
  );
};
