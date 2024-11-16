import { type InferGetServerSidePropsType } from "next";
import Head from "next/head";
import { type Page } from "sanity.types";
import "react-multi-carousel/lib/styles.css";
import { useWindowSize } from "@uidotdev/usehooks";

import type { NextPageWithLayout } from "./_app";
import { getPageTitle } from "@/utils/helpers";
import { getSSGHelper } from "@/utils/getSSGHelper";
import { api } from "@/utils/api";
import { type PageSectionContent } from "@/utils/types";
import { AppointmentsButton, GalleryPhotoAlbum } from "@/components";
import { useRef, useState } from "react";
import { AnimatedTitle } from "@/components/common/animated-title";
import { Text } from "@/components/ui/text";
import { Container, Flex, Grid, Section } from "@/components/ui/layout";
import { ButtonLink } from "@/components/common/button-link";
import { ArrowRightIcon } from "@radix-ui/react-icons";
import CustomImage from "@/components/common/custom-image";
import CustomPortableText from "@/components/common/custom-portable-text";
import MarqueeText from "@/components/common/marquee-text";
import { usePageSectionsData } from "@/composables/usePageSectionsData";
import { motion, useScroll, useTransform } from "framer-motion";

export const getServerSideProps = async () => {
  const ssg = getSSGHelper();

  await Promise.all([
    ssg.content.getPageData.prefetch({ isIndex: true }),
    ssg.content.getGalleryImages.prefetch({
      limit: 10,
    }),
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
  const {
    heroSectionData,
    spotlightSectionData,
    locationSectionData,
    servicesSectionData,
    gallerySectionData,
    pageData,
  } = usePageSectionsData();

  return (
    <>
      <Head>
        <title>{getPageTitle(pageData?.title, siteSettings?.title)}</title>
        <meta name="description" content={siteSettings?.description} />
      </Head>

      {heroSectionData && <HeroSection data={heroSectionData} />}
      {spotlightSectionData && <SpotlightSection data={spotlightSectionData} />}
      {locationSectionData && <LocationSection data={locationSectionData} />}
      {servicesSectionData && <ServicesSection data={servicesSectionData} />}
      {gallerySectionData && <GallerySection data={gallerySectionData} />}
    </>
  );
};

const HeroSection = ({ data }: { data: PageSectionContent }) => {
  const { data: imagesData } = api.content.getGalleryImages.useQuery({
    limit: data?.title?.length,
  });

  const [activeImageIndex, setActiveImageIndex] = useState(0);

  function handleImageSelect(index: number) {
    setActiveImageIndex(index);
  }

  return (
    <Section className="bg-black" heightScreen>
      <div className="relative h-screen">
        <div className="absolute left-0 top-0 h-full w-full grayscale">
          <CustomImage
            src={imagesData?.items[activeImageIndex]?.image}
            alt={imagesData?.items[activeImageIndex]?.image?.alt}
            width={imagesData?.items[activeImageIndex]?.image?.width}
            height={imagesData?.items[activeImageIndex]?.image?.height}
            loading="eager"
            className="pt-[var(--header-h)] opacity-40 md:pt-[var(--header-h-md)]"
            priority
          />
        </div>
        <Flex
          direction="col"
          items="center"
          justify="center"
          gap="2"
          className="relative z-40 h-full"
        >
          <AnimatedTitle
            activeIndex={activeImageIndex}
            onLetterClick={(index) => handleImageSelect(index)}
            title={data?.title}
          />
          <Text
            variant="body"
            as={"h4"}
            className="!m-0 text-center text-lg text-primary-foreground lg:!text-2xl"
          >
            {data?.subtitle}
          </Text>
          <AppointmentsButton
            variant="secondary"
            className="mt-12 xl:mt-16"
            href={data?.sectionSpecific?.linkButton?.href}
          >
            {data?.sectionSpecific?.linkButton?.text}
          </AppointmentsButton>
        </Flex>
      </div>
    </Section>
  );
};

const SpotlightSection = ({ data }: { data: PageSectionContent }) => {
  return (
    <Section className="bg-background text-center" heightScreen>
      <Container heightFull>
        <Flex
          direction="col"
          items="center"
          justify="center"
          gap="2"
          heightFull
        >
          <Text variant="h2">{data?.title}</Text>
          <Text variant="h5">{data?.subtitle}</Text>
          <CustomPortableText value={data?.text} />
        </Flex>
      </Container>
    </Section>
  );
};

const LocationSection = ({ data }: { data: PageSectionContent }) => {
  return (
    <Section className="border-t-[1px] border-solid border-border bg-primary-foreground">
      <Grid
        heightFull
        cols={{
          base: 1,
          lg: 2,
        }}
      >
        <CustomImage
          src={data?.image}
          alt={data?.image?.alt}
          width={data?.image?.width}
          height={data?.image?.height}
          className="lg:order-4"
        />
        <Container size="2" className="order-2 py-32">
          <Flex
            direction="col"
            justify="center"
            gap="2"
            heightFull
            className="text-center lg:items-baseline lg:text-left"
          >
            <Text variant="h2">{data?.title}</Text>
            <Text variant="h5">{data?.subtitle}</Text>
            <CustomPortableText value={data?.text} />
            <ButtonLink
              variant={"ghost"}
              className="flex gap-2"
              href={data?.sectionSpecific?.linkButton?.href}
            >
              {data?.sectionSpecific?.linkButton?.text}
              <ArrowRightIcon style={{ width: "20px", height: "20px" }} />
            </ButtonLink>
          </Flex>
        </Container>
      </Grid>
    </Section>
  );
};

const ServicesSection = ({ data }: { data: PageSectionContent }) => {
  return (
    <Section className="relative z-40 border-y-[1px] border-solid border-border bg-primary-foreground">
      <Grid
        heightFull
        cols={{
          base: 1,
          lg: 2,
        }}
      >
        <CustomImage
          src={data?.image}
          alt={data?.image?.alt}
          width={data?.image?.width}
          height={data?.image?.height}
        />
        <Container size="2" className="py-32">
          <Flex
            direction="col"
            justify="center"
            gap="2"
            heightFull
            className="text-center lg:items-baseline lg:text-left"
          >
            <Text variant="h2">{data?.title}</Text>
            <Text variant="h5">{data?.subtitle}</Text>
            <CustomPortableText value={data?.text} />
            <ButtonLink
              variant={"ghost"}
              className="flex gap-2"
              href={data?.sectionSpecific?.linkButton?.href}
            >
              {data?.sectionSpecific?.linkButton?.text}
              <ArrowRightIcon style={{ width: "20px", height: "20px" }} />
            </ButtonLink>
          </Flex>
        </Container>
      </Grid>
    </Section>
  );
};

const GallerySection = ({ data }: { data: PageSectionContent }) => {
  const { width } = useWindowSize();
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const xMove = useTransform(scrollYProgress, [0, 1], ["-75%", "25%"]);

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
    <Section className="relative overflow-hidden bg-secondary">
      <Container size="2">
        <Flex
          direction="col"
          justify="center"
          gap="2"
          heightFull
          className="relative py-40 text-center lg:py-60"
        >
          <motion.div
            className="absolute h-[175%] w-[125%] bg-gradient-to-r from-green-50 to-blue-50 shadow-sm blur-[2px]"
            style={{
              scale: useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1, 0.8]),
              rotate: useTransform(scrollYProgress, [0, 1], [-25, 0]),
              left: xMove,
              top: "-37.5%",
              zIndex: 20,
            }}
            transition={hoverTransition}
          />

          <Text variant="h5">{data?.subtitle}</Text>
          <CustomPortableText
            value={data?.text}
            className="!lg:text-3xl z-40 !text-lg"
          />
        </Flex>
      </Container>
      {width && (
        <Container size="5">
          <GalleryPhotoAlbum width={width} className="relative z-40" />
        </Container>
      )}

      <MarqueeText text={data?.sectionSpecific?.marqueeText} className="py-12">
        <ButtonLink
          variant={"ghost"}
          className="mr-48 flex gap-2 font-black"
          href={data?.sectionSpecific?.linkButton?.href}
        >
          {data?.sectionSpecific?.linkButton?.text}
          <ArrowRightIcon style={{ width: "20px", height: "20px" }} />
        </ButtonLink>
      </MarqueeText>
    </Section>
  );
};

export default Page;
