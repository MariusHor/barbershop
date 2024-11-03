import { type InferGetServerSidePropsType } from "next";
import Head from "next/head";
import { type Page } from "sanity.types";
import Image from "next/image";
import Marquee from "react-fast-marquee";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { useMeasure } from "@uidotdev/usehooks";

import type { NextPageWithLayout } from "./_app";
import { cn, getPageTitle } from "@/utils/helpers";
import { getSSGHelper } from "@/utils/getSSGHelper";
import { api } from "@/utils/api";
import { type PageSection } from "@/utils/types";
import { urlFor } from "@/lib/sanity/client";
import {
  ColumnSection,
  RowSection,
  ScheduleButton,
  GalleryPhotoAlbum,
} from "@/components";
import { useEffect, useRef, useState } from "react";
import { StayInTouch } from "@/components/common/stay-in-touch";
import { AnimatedTitle } from "@/components/common/animated-title";
import { Text } from "@/components/ui/text";

export const getServerSideProps = async () => {
  const ssg = getSSGHelper();

  const pageData = await ssg.content.getPageData.fetch({ slug: "acasa" });

  await Promise.all([
    pageData,
    ssg.content.getGalleryImages.prefetch({
      limit: pageData?.sections?.[0]?.title?.length,
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

  const heroSectionData = pageData.sections.find(
    (section) => section.value === "intro",
  );

  return (
    <>
      <Head>
        <title>{getPageTitle(pageData?.title, siteSettings?.title)}</title>
        <meta name="description" content={siteSettings?.description} />
      </Head>

      {heroSectionData && <HeroSection data={heroSectionData} />}
      {pageData.sections.slice(1).map((section, index) =>
        section.style.includes("column") ? (
          <ColumnSection
            key={index}
            data={section}
            className={cn({ "justify-start": !!section.withGallery })}
          >
            {section.withGallery
              ? ({ width }) => <GalleryPhotoAlbum width={width} />
              : undefined}
          </ColumnSection>
        ) : (
          <RowSection
            key={index}
            data={section}
            className={cn(
              section.style.includes("reversed")
                ? "border-b-[1px] border-t-[1px]"
                : "border-b-[1px]",
              "bg-secondary",
            )}
            reverse={section.style.includes("reversed")}
          />
        ),
      )}
      <StayInTouch />
    </>
  );
};

const HeroSection = ({ data }: { data: PageSection }) => {
  const { data: imagesData } = api.content.getGalleryImages.useQuery({
    limit: data.title?.length,
  });

  const DEFAULT_CAROUSEL_SIZE = 564;
  const [rootElement, { height: rootElHeight }] = useMeasure();
  const carouselElement = useRef<Carousel>(null);
  const [carouselElMaxHeight, setCarouselElementMaxHeight] = useState(0);
  const [isImageLoading, setImageLoading] = useState(true);
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const heroImage = data?.image;
  const responsiveCarousel = {
    general: {
      breakpoint: { min: 0, max: 4000 },
      items: 1,
    },
  };

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
    <section
      className="relative grid h-screen w-full bg-black lg:grid-cols-2"
      ref={rootElement}
    >
      <div className="relative">
        {heroImage && (
          <div className="absolute left-0 top-0 h-full w-full grayscale">
            <Image
              src={urlFor(heroImage).url()}
              alt={heroImage.alt ?? "hero image"}
              width={heroImage.width}
              height={heroImage.height}
              className={cn(
                "h-full w-full object-cover opacity-40",
                `${isImageLoading ? "blur" : "remove-blur"}`,
              )}
              onLoad={() => setImageLoading(false)}
              priority
            />
          </div>
        )}

        <div className="relative z-40 flex h-full flex-col items-center justify-center gap-16">
          <AnimatedTitle
            activeIndex={activeSlideIndex}
            onLetterClick={(index) => handleSlideSelect(index)}
            title={data.title}
          />

          <Text variant={"h2"} className="text-primary-foreground">
            {data.subtitle}
          </Text>

          <ScheduleButton variant={"secondary"} className="xl:mt-4" />
        </div>
      </div>
      <div className="relative hidden flex-col items-center justify-center gap-16 overflow-hidden bg-white px-20 lg:flex">
        <div
          className="relative z-10 aspect-square w-full select-none overflow-hidden border-[1px] border-solid border-muted-foreground"
          style={{
            maxHeight: carouselElMaxHeight,
            maxWidth: DEFAULT_CAROUSEL_SIZE,
          }}
        >
          <Carousel
            ref={carouselElement}
            responsive={responsiveCarousel}
            itemClass="h-full"
            containerClass="h-full"
            sliderClass="h-full"
            ssr={true}
            draggable={false}
            swipeable={false}
            arrows={false}
            autoPlay={true}
            rewind={true}
            autoPlaySpeed={4000}
            beforeChange={handleBeforeSlideChange}
          >
            {imagesData?.items.map((item, index) => (
              <Image
                key={index}
                src={urlFor(item.image).url()}
                alt={item.image.alt ?? "hero image"}
                width={item.image.width}
                height={item.image.height}
                className="relative z-0 h-full w-full select-none object-cover"
                priority
              />
            ))}
          </Carousel>
        </div>
        {data.marqueeText && (
          <Marquee
            autoFill
            pauseOnHover
            className="!absolute bottom-0 bg-background py-6 border-t-[1px] border-secondary-foreground"
          >
            <Text variant="body" className="ml-40 !text-2xl font-black">
              {data.marqueeText}
            </Text>
          </Marquee>
        )}
      </div>
    </section>
  );
};

export default Page;
