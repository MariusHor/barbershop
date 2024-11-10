import { type InferGetServerSidePropsType } from "next";
import { type NextPageWithLayout } from "./_app";
import Head from "next/head";

import { api } from "@/utils/api";
import { getPageTitle, getSectionContent } from "@/utils/helpers";
import { getSSGHelper } from "@/utils/getSSGHelper";
import { GalleryPhotoAlbum, ScheduleButton } from "@/components";
import { FollowSection } from "@/components/common/follow-section";
import { type PageSection } from "@/utils/types";
import { useWindowSize } from "@uidotdev/usehooks";
import { Container, Flex, Grid, Section } from "@/components/ui/layout";
import { Text } from "@/components/ui/text";
import CustomPortableText from "@/components/common/custom-portable-text";
import { ButtonLink } from "@/components/common/button-link";
import { ArrowRightIcon } from "@radix-ui/react-icons";
import CustomImage from "@/components/common/custom-image";

export const getServerSideProps = async () => {
  const ssg = getSSGHelper();

  await Promise.all([
    ssg.content.getGalleryImages.prefetch({
      limit: 10,
    }),
    ssg.content.getPageData.prefetch({ slug: "galerie" }),
    ssg.content.getSiteSettings.prefetch(),
    ssg.content.getSiteLogo.prefetch(),
    ssg.content.getShopLocation.prefetch(),
    ssg.content.getRoutes.prefetch(),
  ]);

  return {
    props: {
      trpcState: ssg.dehydrate(),
    },
  };
};

const Page: NextPageWithLayout<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = () => {
  const { data: siteSettings } = api.content.getSiteSettings.useQuery();
  const { data: pageData } = api.content.getPageData.useQuery({
    slug: "galerie",
  });

  if (!pageData?.sections?.length) {
    throw new Error("Missing 'Galerie' page Sanity sections data");
  }

  const heroSectionData = getSectionContent(pageData, "hero");
  const gallerySectionData = getSectionContent(pageData, "gallery");

  return (
    <>
      <Head>
        <title>{getPageTitle(pageData?.title, siteSettings?.title)}</title>
        <meta name="description" content={siteSettings?.description} />
      </Head>

      {heroSectionData && <HeroSection data={heroSectionData} />}
      {gallerySectionData && <GallerySection data={gallerySectionData} />}
      <FollowSection className="bg-secondary" />
    </>
  );
};

const HeroSection = ({ data }: { data: PageSection }) => {
  return (
    <Section className="bg-secondary" heightScreen>
      <Grid
        cols={{
          base: 1,
          lg: 2,
        }}
        heightFull
        className="pt-[calc(var(--header-height)_-24px)] md:pt-[var(--header-height)]"
      >
        <CustomImage
          src={data?.image}
          alt={data?.image?.alt}
          width={data?.image?.width}
          height={data?.image?.height}
          className="hidden lg:block"
        />

        <Container size="2">
          <Flex
            direction="col"
            justify="center"
            gap="2"
            heightFull
            className="items-center text-center lg:items-baseline lg:text-left"
          >
            <Text variant="h2">{data?.title}</Text>
            <Text variant="h4">{data?.subtitle}</Text>
            <CustomPortableText value={data?.text} />
            <ButtonLink
              href={data?.sectionSpecific?.linkButton?.href}
              variant={"ghost"}
              size={"default"}
              className="flex gap-2"
            >
              {data?.sectionSpecific?.linkButton?.text}
              <ArrowRightIcon style={{ width: "20px", height: "20px" }} />
            </ButtonLink>
            <ScheduleButton className="hover:bg-background" />
          </Flex>
        </Container>
      </Grid>
    </Section>
  );
};

const GallerySection = ({ data }: { data: PageSection }) => {
  const { width } = useWindowSize();

  return (
    <Section className="relative pb-16" id="lista-completa">
      <Container size="2" className="py-32">
        <Flex
          direction="col"
          justify="center"
          gap="2"
          heightFull
          className="text-center"
        >
          <Text variant="h2">{data?.title}</Text>
          <Text variant="h4">{data?.subtitle}</Text>
          <CustomPortableText value={data?.text} />
        </Flex>
      </Container>
      {width && <GalleryPhotoAlbum width={width} />}
    </Section>
  );
};

export default Page;
