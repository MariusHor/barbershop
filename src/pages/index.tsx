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
  Gallery,
  RowSection,
  ScheduleButton,
} from "@/components";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";

export const getServerSideProps = async () => {
  const ssg = getSSGHelper();

  const pageData = await ssg.content.getPageData.fetch({ slug: "acasa" });

  await Promise.all([
    pageData,
    ssg.content.getGalleryImages.prefetch({
      end: pageData?.sections?.[0]?.title?.length,
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

  const { data: galleryImages } = api.content.getGalleryImages.useQuery(
    {},
    { enabled: !!pageData.sections.some((section) => section.withGallery) },
  );
  const _galleryImages =
    galleryImages?.map((item) => ({
      src: urlFor(item.image).url(),
      width: item.image.width ?? 0,
      height: item.image.height ?? 0,
    })) ?? [];

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
          <ColumnSection key={index} data={section}>
            {section.withGallery
              ? ({ width }) => <Gallery width={width} data={_galleryImages} />
              : undefined}
          </ColumnSection>
        ) : (
          <RowSection
            key={index}
            data={section}
            className={
              section.style.includes("reversed")
                ? "border-b-[1px] border-t-[1px]"
                : "border-b-[1px]"
            }
            reverse={section.style.includes("reversed")}
          />
        ),
      )}
    </>
  );
};

const HeroSection = ({ data }: { data: PageSection }) => {
  const { data: imagesData } = api.content.getGalleryImages.useQuery({
    end: data.title?.length,
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

  if (!imagesData?.length) {
    throw new Error("Missing gallery images");
  }

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
          <h1 className="flex gap-4 text-center opacity-100 md:gap-6 xl:gap-8">
            {data.title?.split("").map((letter, index) => (
              <Button
                key={index}
                variant={"ghost"}
                className={cn(
                  "p-0 text-6xl font-black text-muted hover:bg-transparent hover:text-primary-foreground md:text-8xl 2xl:text-9xl",
                  {
                    "text-primary": activeSlideIndex === index,
                  },
                )}
                onClick={() => handleSlideSelect(index)}
              >
                {letter}
              </Button>
            ))}
          </h1>

          {data?.subtitle && (
            <p className="max-w-[736px] text-center text-lg text-white opacity-100 sm:text-xl md:text-2xl xl:text-3xl">
              {data?.subtitle}
            </p>
          )}

          <ScheduleButton
            className="bg-white text-dark hover:text-muted xl:mt-4"
            text={data.linkButton?.text}
            href={data.linkButton?.href}
          />
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
            {imagesData.map((item, index) => (
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
        <div className="absolute bottom-0 bg-background-secondary py-6">
          {data.marqueeText && (
            <Marquee autoFill pauseOnHover>
              <span className="font-500 mr-8 text-3xl">{data.marqueeText}</span>
            </Marquee>
          )}
        </div>
      </div>
    </section>
  );
};

export default Page;
