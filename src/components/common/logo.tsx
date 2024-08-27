import { api } from "@/utils/api";
import { urlFor } from "@/lib/sanity/client";
import { ImageLink } from "../base/image-link";

type Props = {
  width?: number;
  height?: number;
};

export const Logo = ({ width, height }: Props): React.JSX.Element | null => {
  const { data } = api.content.getSiteLogo.useQuery();

  if (!data?.image) return null;

  return (
    <ImageLink
      href={"/"}
      src={urlFor(data.image).url()}
      alt="website logo"
      width={width ?? data.image.width}
      height={height ?? data.image.height}
    />
  );
};
