import { api } from "@/utils/api";
import { SiteLogo } from "./site-logo";
import { SocialLinks } from "./social-links";
import { cn } from "@/utils/helpers";
import { Container, Flex, Section } from "../ui/layout";
import CustomPortableText from "./custom-portable-text";

export const FollowSection = ({ className }: { className?: string }) => {
  const { data: siteSettings } = api.content.getSiteSettings.useQuery();

  return (
    <Section className={cn("py-16 text-center", className)} spacing="1">
      <Container size="1">
        <Flex items="center" justify="center" direction="col">
          <SiteLogo size={"lg"} />
          <CustomPortableText value={siteSettings?.followCta?.text} />
          <SocialLinks />
        </Flex>
      </Container>
    </Section>
  );
};
