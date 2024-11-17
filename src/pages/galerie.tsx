import { useRef } from "react";
import { ArrowRightIcon } from "@radix-ui/react-icons";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  type GetServerSidePropsContext,
  type InferGetServerSidePropsType,
} from "next";
import Head from "next/head";
import { useWindowSize } from "@uidotdev/usehooks";

import { type NextPageWithLayout } from "./_app";
import { api } from "@/utils/api";
import { getPageTitle } from "@/utils/helpers";
import { getSSGHelper } from "@/utils/getSSGHelper";
import { type PageSectionData } from "@/utils/types";
import { usePageSectionsData } from "@/hooks/use-page-sections-data";
import {
  ButtonLink,
  CustomImage,
  GalleryPhotoAlbum,
  AppointmentsButton,
  Container,
  Flex,
  Grid,
  Section,
  Text,
  CustomPortableText,
  Separator,
} from "@/components";

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

const HeroSection = ({ data }: { data: PageSectionData }) => {
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

const ImageGrid = ({ data }: { data: PageSectionData }) => {
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

const GallerySection = ({ data }: { data: PageSectionData }) => {
  const { width } = useWindowSize();

  return (
    <Section
      className="relative h-full bg-white pb-[148px]"
      id="lista-completa"
    >
      <Container size="5" className="lg:hidden">
        <Separator />
      </Container>
      <Container size="2" className="py-[148px] text-center">
        <Text variant="h2">{data?.title}</Text>
        <Text variant="h5" className="mt-2">
          {data?.subtitle}
        </Text>
        <CustomPortableText value={data?.text} />
      </Container>
      {width && <GalleryPhotoAlbum width={width} />}
    </Section>
  );
};

export default Page;
