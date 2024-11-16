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
import { type PageSectionContent } from "@/utils/types";
import { useWindowSize } from "@uidotdev/usehooks";
import { Container, Flex, Grid, Section } from "@/components/ui/layout";
import { Text } from "@/components/ui/text";
import CustomPortableText from "@/components/common/custom-portable-text";
import { ButtonLink } from "@/components/common/button-link";
import { ArrowRightIcon } from "@radix-ui/react-icons";
import CustomImage from "@/components/common/custom-image";
import { usePageSectionsData } from "@/composables/usePageSectionsData";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

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
        <ImageGrid data={data} />
        <Container size="2" className="z-[30]">
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
            <AppointmentsButton />
          </Flex>
        </Container>
      </Grid>
    </Section>
  );
};

const ImageGrid = ({ data }: { data: PageSectionContent }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [-50, 50]);
  const y2 = useTransform(scrollYProgress, [0, 1], [-100, 100]);

  const springConfig = {
    stiffness: 200,
    damping: 25,
    mass: 1.2,
  };

  const hoverTransition = {
    type: "spring",
    ...springConfig,
    duration: 0.4,
  };

  return (
    <div
      ref={containerRef}
      className="relative hidden h-[800px] w-full py-20 lg:block"
    >
      <motion.div
        className="absolute inset-0 z-20 h-full w-full bg-gradient-to-r from-green-50 to-blue-50 shadow-sm blur-[2px]"
        style={{
          scale: useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1, 0.8]),
          rotate: useTransform(scrollYProgress, [0, 1], [45, 90]),
        }}
        transition={hoverTransition}
      />

      <div className="relative z-30 mx-auto max-w-7xl">
        <div className="relative">
          <motion.div
            className="absolute left-[104px] top-0 w-72 xl:left-[204px]"
            whileHover={{
              scale: 1.05,
              rotate: -2,
              zIndex: 40,
            }}
            initial={{ zIndex: 30 }}
            style={{ y: y1 }}
            transition={hoverTransition}
          >
            <motion.div
              whileHover={{
                scale: 1.02,
              }}
              transition={{
                scale: {
                  type: "spring",
                  ...springConfig,
                },
                layout: true,
              }}
              layout
            >
              <CustomImage
                src={data?.image}
                alt={data?.image?.alt}
                width={data?.image?.width}
                height={data?.image?.height}
                className="object-cover shadow-lg transition-all duration-500"
              />
            </motion.div>
          </motion.div>

          <motion.div
            className="absolute left-[184px] top-[184px] w-72 xl:left-[324px] 2xl:left-[424px]"
            whileHover={{
              scale: 1.05,
              rotate: 2,
              zIndex: 40,
            }}
            initial={{ zIndex: 30 }}
            style={{ y: y2 }}
            transition={hoverTransition}
          >
            <motion.div
              whileHover={{
                scale: 1.02,
              }}
              transition={{
                scale: {
                  type: "spring",
                  ...springConfig,
                },
                layout: true,
              }}
              layout
            >
              <CustomImage
                src={data?.image}
                alt={data?.image?.alt}
                width={data?.image?.width}
                height={data?.image?.height}
                className="object-cover shadow-lg transition-all duration-500"
              />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

const GallerySection = ({ data }: { data: PageSectionContent }) => {
  const { width } = useWindowSize();

  return (
    <Section className="relative bg-white py-[184px]" id="lista-completa">
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
