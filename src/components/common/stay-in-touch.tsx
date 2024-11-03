import { api } from "@/utils/api";
import { SiteLogo } from "./site-logo";
import { SocialLinks } from "./social-links";
import { cn } from "@/utils/helpers";

export const StayInTouch = ({ className }: { className?: string }) => {
  const { data: siteSettings } = api.content.getSiteSettings.useQuery();

  return (
    <section className={cn("py-16", className)}>
      <div className="container-md flex flex-col items-center justify-center gap-6">
        <SiteLogo size={"lg"}/>

        <p className="max-w-[512px] text-center text-lg leading-7 text-dark-foreground">
          Stay in the loop on special events, new arrivals, and exclusive
          collaborations brought to you by the crew at {siteSettings?.title}.
        </p>

        <SocialLinks />
      </div>
    </section>
  );
};
