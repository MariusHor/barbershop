import {
  type GetServerSidePropsContext,
  type InferGetServerSidePropsType,
} from "next";
import { type NextPageWithLayout } from "./_app";
import Head from "next/head";

import { api } from "@/utils/api";
import { getPageTitle } from "@/utils/helpers";
import { getSSGHelper } from "@/utils/getSSGHelper";
import { GalleryPhotoAlbum, AppointmentsButton } from "@/components";
import { FollowSection } from "@/components/common/follow-section";
import { type PageSectionContent } from "@/utils/types";
import { useWindowSize } from "@uidotdev/usehooks";
import { Container, Flex, Grid, Section } from "@/components/ui/layout";
import { Text } from "@/components/ui/text";
import CustomPortableText from "@/components/common/custom-portable-text";
import { ButtonLink } from "@/components/common/button-link";
import { ArrowRightIcon } from "@radix-ui/react-icons";
import CustomImage from "@/components/common/custom-image";
import { usePageSectionsData } from "@/composables/usePageSectionsData";

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
) => {
  const slug = context.resolvedUrl.slice(1);
  const ssg = getSSGHelper();

  await Promise.all([
    ssg.content.getGalleryImages.prefetch({
      limit: 10,
    }),
    ssg.content.getPageData.prefetch({ slug }),
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
  const { heroSectionData, gallerySectionData, pageData } =
    usePageSectionsData();

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

const HeroSection = ({ data }: { data: PageSectionContent }) => {
  return (
    <Section className="bg-secondary" heightScreen>
      <Grid
        cols={{
          base: 1,
          lg: 2,
        }}
        heightFull
        className="pt-[var(--header-h)] md:pt-[var(--header-h-md)]"
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
            <Text variant="h1">{data?.title}</Text>
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
            <AppointmentsButton className="hover:bg-background" />
          </Flex>
        </Container>
      </Grid>
    </Section>
  );
};

const GallerySection = ({ data }: { data: PageSectionContent }) => {
  const { width } = useWindowSize();

  return (
    <Section className="relative bg-white py-16" id="lista-completa">
      <Flex direction="col" gap="7">
        <Container size="2">
          <Flex
            direction="col"
            justify="center"
            gap="2"
            heightFull
            className="text-center"
          >
            <Text variant="h2">{data?.title}</Text>
            <Text variant="h5" className="mt-2">
              {data?.subtitle}
            </Text>
            <CustomPortableText value={data?.text} />
          </Flex>
        </Container>
        {width && <GalleryPhotoAlbum width={width} />}
      </Flex>
    </Section>
  );
};

export default Page;
