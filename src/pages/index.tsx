import { useEffect, useRef, useState } from "react";
import { ArrowRightIcon } from "@radix-ui/react-icons";
import { type InferGetServerSidePropsType } from "next";
import Head from "next/head";
import { type Page } from "sanity.types";
import { useWindowSize } from "@uidotdev/usehooks";
import { motion, useScroll, useTransform } from "framer-motion";
import Autoplay from "embla-carousel-autoplay";
import "react-multi-carousel/lib/styles.css";

import type { NextPageWithLayout } from "./_app";
import { usePageSectionsData } from "@/hooks/use-page-sections-data";
import { getPageTitle } from "@/utils/helpers";
import { getSSGHelper } from "@/utils/getSsgHelper";
import { api } from "@/utils/api";
import { type PageSectionData } from "@/utils/types";
import {
  AnimatedTitle,
  AppointmentsButton,
  GalleryPhotoAlbum,
  CustomImage,
  CustomPortableText,
  MarqueeText,
  Text,
  Container,
  Flex,
  Grid,
  Section,
  ButtonLink,
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components";

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

const HeroSection = ({ data }: { data: PageSectionData }) => {
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  const { data: imagesData } = api.content.getGalleryImages.useQuery({
    limit: data?.title?.length,
  });

  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    if (!carouselApi) {
      return;
    }

    carouselApi.on("select", () => {
      const nextIndex = carouselApi.selectedScrollSnap();
      setActiveImageIndex(nextIndex);
    });
  }, [carouselApi, imagesData]);

  function handleImageSelect(index: number) {
    if (!carouselApi) return;
    carouselApi.scrollTo(index);
    setActiveImageIndex(index);
  }

  return (
    <Section
      className="bg-black pt-[var(--header-h)] md:pt-[var(--header-h-md)]"
      heightScreen
    >
      <div className="relative h-full">
        <Carousel
          className="h-full opacity-50"
          setApi={setCarouselApi}
          opts={{
            loop: true,
            axis: "y",
            watchDrag: false
          }}
          plugins={[
            Autoplay({
              delay: 5000,
              stopOnInteraction: false,
              stopOnMouseEnter: false,
            }),
          ]}
          orientation="vertical"
        >
          <CarouselContent
            className="relative !m-0 h-full flex-col"
            style={{
              height: "100%",
            }}
          >
            {imagesData?.items?.map((item, index) => (
              <CarouselItem
                key={index}
                className="relative !p-0"
                style={{
                  height: "100%",
                  minHeight: "100%",
                }}
              >
                <CustomImage
                  src={item.image}
                  alt={item.image.alt}
                  className="h-full w-full object-cover grayscale select-none"
                  width={item.image.width}
                  height={item.image.height}
                  priority
                  loading="eager"
                />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
        <Flex
          direction="col"
          items="center"
          justify="center"
          gap="2"
          className="absolute left-1/2 top-1/2 z-40 -translate-x-1/2 -translate-y-1/2"
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

const SpotlightSection = ({ data }: { data: PageSectionData }) => {
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

const LocationSection = ({ data }: { data: PageSectionData }) => {
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

const ServicesSection = ({ data }: { data: PageSectionData }) => {
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

const GallerySection = ({ data }: { data: PageSectionData }) => {
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
