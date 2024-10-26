import Link from "next/link";
import { Icon } from "@iconify-icon/react";

import { api } from "@/utils/api";

export const SocialLinks = () => {
  const { data } = api.content.getShopLocation.useQuery();

  if (!data?.socialPlatforms) return null;

  return (
    <div className="flex w-fit gap-2">
      {data.socialPlatforms.map((platform) => (
        <Link
          href={platform.link}
          target="_blank"
          key={platform.name}
          className="flex justify-center"
        >
          <Icon
            icon={`mdi:${platform.name}`}
            className="text-4xl hover:text-primary-foreground lg:text-5xl"
          />
        </Link>
      ))}
    </div>
  );
};
