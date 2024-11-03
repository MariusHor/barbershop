import { Icon } from "@iconify-icon/react";

import { api } from "@/utils/api";
import { ButtonLink } from "./button-link";

export const SocialLinks = () => {
  const { data } = api.content.getShopLocation.useQuery();

  if (!data?.socialPlatforms) return null;

  return (
    <div className="flex w-fit gap-2">
      {data.socialPlatforms.map((platform) => (
        <ButtonLink href={platform.link} key={platform.name} variant={"ghost"}>
          <Icon
            icon={`mdi:${platform.name}`}
            className="text-3xl lg:text-4xl"
          />
        </ButtonLink>
      ))}
    </div>
  );
};
