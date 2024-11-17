import { Icon } from "@iconify/react";

import { api } from "@/utils/api";
import { ButtonLink } from "./button-link";
import { cn } from "@/utils/helpers";

export const SocialLinks = ({ className }: { className?: string }) => {
  const { data: locationData } = api.content.getShopLocation.useQuery();
  const { data: siteSettingsData } = api.content.getSiteSettings.useQuery(
    undefined,
    { enabled: !locationData?.socialPlatforms },
  );

  const socialPlatforms =
    locationData?.socialPlatforms ?? siteSettingsData?.socialPlatforms;

  if (!socialPlatforms) return null;

  return (
    <div className={cn("flex w-fit gap-2", className)}>
      {socialPlatforms.map((platform) => (
        <ButtonLink href={platform.link} key={platform.name} variant={"ghost"}>
          <Icon
            icon={`mdi:${platform.name}`}
            className="text-3xl lg:text-4xl"
            mode="svg"
            width="24"
            height="24"
          />
        </ButtonLink>
      ))}
    </div>
  );
};
