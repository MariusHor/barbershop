import { api } from "@/utils/api";
import { urlFor } from "@/utils/sanity/client";
import Image from "next/image";
import Link from "next/link";

export const BaseLogo = ({
  size = { width: 96, height: 40 },
}): React.JSX.Element => {
  const { data } = api.content.getLogo.useQuery();

  return (
    <Link href={"/"}>
      <Image
        src={urlFor(data?.imgUrl ?? "").url()}
        alt="website logo"
        width={data?.width}
        height={data?.height}
        priority
        className={`h-[${size.height}px]`}
      />
    </Link>
  );
};
