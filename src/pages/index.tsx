import { type InferGetServerSidePropsType } from "next";
import Head from "next/head";
import { type Page } from "sanity.types";
import type Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { useMeasure, useWindowSize } from "@uidotdev/usehooks";

import type { NextPageWithLayout } from "./_app";
import { getPageTitle, getSectionContent } from "@/utils/helpers";
import { getSSGHelper } from "@/utils/getSSGHelper";
import { api } from "@/utils/api";
import { type PageSection } from "@/utils/types";
import { ScheduleButton, GalleryPhotoAlbum } from "@/components";
import { useEffect, useRef, useState } from "react";
import { AnimatedTitle } from "@/components/common/animated-title";
import { Text } from "@/components/ui/text";
import { Container, Flex, Grid, Section } from "@/components/ui/layout";
import { ButtonLink } from "@/components/common/button-link";
import { ArrowRightIcon } from "@radix-ui/react-icons";
import CustomImage from "@/components/common/custom-image";
import CustomPortableText from "@/components/common/custom-portable-text";
import MarqueeText from "@/components/common/marquee-text";
import CustomCarousel from "@/components/common/custom-carousel";
import { FollowSection } from "@/components/common/follow-section";

export const getServerSideProps = async () => {
  const ssg = getSSGHelper();

  const pageData = await ssg.content.getPageData.fetch({ slug: "acasa" });

  await Promise.all([
    pageData,
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
  const { data: pageData } = api.content.getPageData.useQuery({
    slug: "acasa",
  });

  if (!pageData?.sections?.length) {
    throw new Error("Missing 'Acasa' page Sanity sections data");
  }

  const heroSectionData = getSectionContent(pageData, "hero");
  const spotlightSectionData = getSectionContent(pageData, "spotlight");
  const locationSectionData = getSectionContent(pageData, "location");
  const servicesSectionData = getSectionContent(pageData, "services");
  const gallerySectionData = getSectionContent(pageData, "gallery");

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
      <FollowSection className="bg-secondary" />
    </>
  );
};

const HeroSection = ({ data }: { data: PageSection }) => {
  const { data: imagesData } = api.content.getGalleryImages.useQuery({
    limit: data?.title?.length,
  });

  const DEFAULT_CAROUSEL_SIZE = 564;
  const [rootElement, { height: rootElHeight }] = useMeasure();
  const carouselElement = useRef<Carousel>(null);
  const [carouselElMaxHeight, setCarouselElementMaxHeight] = useState(
    DEFAULT_CAROUSEL_SIZE,
  );
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);

  useEffect(() => {
    if (!rootElHeight) return;

    setCarouselElementMaxHeight(
      Math.min(Math.round(rootElHeight * 0.6), DEFAULT_CAROUSEL_SIZE),
    );
  }, [rootElHeight]);

  function handleSlideSelect(index: number) {
    if (!carouselElement.current) return;

    setActiveSlideIndex(index);
    carouselElement.current.goToSlide(index);
  }

  function handleBeforeSlideChange(nextSlide: number) {
    setActiveSlideIndex(nextSlide);
  }

  return (
    <Section className="bg-black" ref={rootElement}>
      <Grid
        cols={{
          base: 1,
          lg: 2,
        }}
        heightScreen
      >
        <div className="relative">
          <div className="absolute left-0 top-0 h-full w-full grayscale">
            <CustomImage
              src={data?.image}
              alt={data?.image?.alt}
              width={data?.image?.width}
              height={data?.image?.height}
              loading="eager"
              className="opacity-40"
              priority
            />
          </div>
          <Flex
            direction="col"
            items="center"
            justify="center"
            gap="6"
            className="relative z-40 h-full"
          >
            <AnimatedTitle
              activeIndex={activeSlideIndex}
              onLetterClick={(index) => handleSlideSelect(index)}
              title={data?.title}
            />
            <Text variant="h2" className="text-primary-foreground">
              {data?.subtitle}
            </Text>
            <ScheduleButton
              variant="secondary"
              className="xl:mt-4"
              href={data?.sectionSpecific?.linkButton?.href}
            >
              {data?.sectionSpecific?.linkButton?.text}
            </ScheduleButton>
          </Flex>
        </div>
        <Flex
          direction="col"
          items="center"
          justify="center"
          gap="6"
          className="relative hidden bg-white px-20 lg:flex"
        >
          <div
            className="relative z-10 aspect-square h-full w-full rounded-md bg-black shadow-2xl"
            style={{
              maxHeight: carouselElMaxHeight,
              maxWidth: DEFAULT_CAROUSEL_SIZE,
            }}
          >
            <CustomCarousel
              ref={carouselElement}
              images={imagesData?.items}
              beforeChange={handleBeforeSlideChange}
              className="rounded-md border-[1px] border-solid border-muted-foreground"
              responsive={{
                general: {
                  breakpoint: { min: 0, max: 4000 },
                  items: 1,
                },
              }}
            />
          </div>
          <MarqueeText
            text={data?.sectionSpecific?.marqueeText}
            className="!absolute bottom-0 border-t-[1px] border-secondary-foreground bg-foreground py-6"
            textClassName="text-background"
          />
        </Flex>
      </Grid>
    </Section>
  );
};

const SpotlightSection = ({ data }: { data: PageSection }) => {
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
          <Text variant="h4">{data?.subtitle}</Text>
          <CustomPortableText value={data?.text} />
        </Flex>
      </Container>
    </Section>
  );
};

const LocationSection = ({ data }: { data: PageSection }) => {
  return (
    <Section className="border-t-[1px] border-solid border-secondary-foreground bg-primary-foreground">
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
            <Text variant="h4">{data?.subtitle}</Text>
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

const ServicesSection = ({ data }: { data: PageSection }) => {
  return (
    <Section className="border-y-[1px] border-solid border-secondary-foreground bg-primary-foreground">
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
            <Text variant="h4">{data?.subtitle}</Text>
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

const GallerySection = ({ data }: { data: PageSection }) => {
  const { width } = useWindowSize();

  return (
    <Section className="relative pb-16">
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

      <MarqueeText
        text={data?.sectionSpecific?.marqueeText}
        className="!absolute bottom-0 border-b-[1px] border-solid border-secondary-foreground"
      >
        <ButtonLink
          variant={"ghost"}
          className="my-4 mr-48 flex gap-2 font-black"
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
