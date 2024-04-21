import Link from "next/link";
import { Icon } from "@iconify-icon/react";

import { api } from "@/utils/api";

export const SocialLinks = () => {
  const { data } = api.content.getLocation.useQuery();

  if (!data?.socialPlatforms) return false;

  return (
    <div className="flex w-fit gap-2">
      {data.socialPlatforms.map((platform) => (
        <Link
          href={platform.link ?? ""}
          target="_blank"
          key={platform.name}
          className="flex justify-center"
        >
          <Icon
            icon={`mdi:${platform.name}`}
            className="text-5xl hover:text-gray-600"
          />
        </Link>
      ))}
    </div>
  );
};
