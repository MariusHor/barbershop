import { api } from "@/utils/api";
import { urlFor } from "@/lib/sanity/client";
import { ImageLink } from "../base/image-link";
import { cn } from "@/utils/helpers";

type Props = {
  width?: number;
  height?: number;
  className?: string;
};

export const Logo = ({
  width,
  height,
  className,
}: Props): React.JSX.Element | null => {
  const { data } = api.content.getSiteLogo.useQuery();

  if (!data?.image) return null;

  return (
    <ImageLink
      href={"/"}
      src={urlFor(data.image).url()}
      alt="website logo"
      width={width ?? data.image.width}
      height={height ?? data.image.height}
      className={cn("max-w-40 xl:max-w-48", className)}
    />
  );
};
