import { api } from "@/utils/api";
import { urlFor } from "@/lib/sanity/client";
import { ImageLink } from "../base/image-link";

type Props = {
  width?: number;
  height?: number;
};

export const Logo = ({ width, height }: Props): React.JSX.Element => {
  const { data } = api.content.getSiteLogo.useQuery();

  return (
    <ImageLink
      href={"/"}
      src={urlFor(data?.imgUrl ?? "").url()}
      alt="website logo"
      width={width ?? data?.width}
      height={height ?? data?.height}
    />
  );
};
