import { type InferGetServerSidePropsType } from "next";
import Head from "next/head";
import { type Page } from "sanity.types";
import Image from "next/image";
import Marquee from "react-fast-marquee";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { ArrowRightIcon } from "@radix-ui/react-icons";
import PhotoAlbum from "react-photo-album";
import { useMeasure, useWindowSize } from "@uidotdev/usehooks";

import type { NextPageWithLayout } from "./_app";
import { cn, getPageTitle } from "@/utils/helpers";
import { getSSGHelper } from "@/utils/getSSGHelper";
import { api } from "@/utils/api";
import { type PageSection } from "@/utils/types";
import { urlFor } from "@/lib/sanity/client";
import { Logo, ScheduleButton, SocialLinks } from "@/components";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

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
      {pageData.sections
        .slice(1)
        .map((section, index) =>
          section.style.includes("column") ? (
            <ColumnSection key={index} data={section} />
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

      <section className="bg-background-secondary pb-16">
        <div className="container-md flex flex-col items-center justify-center gap-6">
          <Logo />

          <p className="max-w-[512px] text-center text-lg leading-7 text-dark-foreground">
            Stay in the loop on special events, new arrivals, and exclusive
            collaborations brought to you by the crew at {siteSettings?.title}.
          </p>

          <SocialLinks />
        </div>
      </section>
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
                  "p-0 text-6xl font-black text-muted hover:bg-transparent hover:text-primary md:text-8xl 2xl:text-9xl",
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
          className="relative z-10 aspect-square w-full select-none overflow-hidden border-[1px] border-solid border-dark"
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
            rtl
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

const ColumnSection = ({
  data,
  className = "",
}: {
  data: PageSection;
  className?: string;
}) => {
  const { data: galleryImages } = api.content.getGalleryImages.useQuery(
    {},
    { enabled: !!data.withGallery },
  );
  const albumImages =
    galleryImages?.map((item) => ({
      src: urlFor(item.image).url(),
      width: item.image.width ?? 0,
      height: item.image.height ?? 0,
    })) ?? [];
  const { width, height } = useWindowSize();
  const rootEl = useRef<HTMLElement>(null);
  const [rootElHeight, setRootElHeight] = useState(0);

  useEffect(() => {
    if (!rootEl.current) return;

    setRootElHeight(parseFloat(getComputedStyle(rootEl.current).height));
  }, [rootEl, width]);

  return (
    <section
      className={cn(
        "flex min-h-screen flex-col items-center justify-center gap-16 bg-background-secondary",
        className,
        {
          "py-16":
            (width && width > 1328) || (height && rootElHeight >= height),
        },
      )}
      ref={rootEl}
    >
      <div className="container-md flex flex-col items-center justify-center gap-12 text-center lg:gap-16">
        {data.title && (
          <h2 className="max-w-[1024px] text-5xl font-semibold text-primary-foreground md:text-6xl lg:text-7xl">
            {data.title}
          </h2>
        )}

        {data.subtitle && (
          <h3 className="max-w-[1024px] text-2xl text-dark-foreground md:text-3xl lg:text-4xl">
            {data.subtitle}
          </h3>
        )}

        {data.content && (
          <p className="max-w-[786px] text-center text-lg leading-8 text-dark-foreground lg:leading-9">
            {data.content}
          </p>
        )}

        {data.linkButton?.href && (
          <Button
            size={"default"}
            variant={"ghost"}
            asChild
            className="flex gap-2 p-0 text-lg hover:bg-transparent hover:text-primary"
          >
            <Link href={data.linkButton?.href}>
              {data.linkButton?.text}
              <ArrowRightIcon style={{ width: "20px", height: "20px" }} />
            </Link>
          </Button>
        )}
      </div>

      {data.withGallery && width && (
        <div className="w-full">
          <PhotoAlbum
            componentsProps={{
              containerProps: {
                style: {
                  gap: width < 768 ? "1px" : width < 1024 ? "2px" : "8px",
                },
              },
              columnContainerProps: {
                style: {
                  width: width < 768 ? "100%" : width < 1024 ? "50%" : "33%",
                  gap: width < 768 ? "1px" : width < 1024 ? "2px" : "8px",
                },
              },
              imageProps: { style: { width: "100%", marginBottom: 0 } },
            }}
            columns={width < 768 ? 1 : width < 1024 ? 2 : 3}
            layout={"masonry"}
            photos={albumImages}
          />
        </div>
      )}
    </section>
  );
};

const RowSection = ({
  data,
  className = "",
  reverse = false,
}: {
  data: PageSection;
  className?: string;
  reverse?: boolean;
}) => {
  return (
    <section
      className={cn(
        "grid max-h-[968px] grid-rows-2 overflow-hidden border-solid border-dark lg:max-h-[484px] lg:grid-cols-2 lg:grid-rows-1",
        className,
      )}
    >
      {data?.image && (
        <div
          className={cn(
            "h-full w-full border-t-[1px] border-solid border-dark object-cover lg:max-h-[484px] lg:border-t-0",
            {
              "order-2 lg:border-l-[1px]": reverse,
              "order-2 lg:order-[0]": !reverse,
            },
          )}
        >
          <Image
            src={urlFor(data.image).url()}
            alt={
              data.image.alt ??
              `Image representing the ${data.title?.toLowerCase()}`
            }
            width={data.image.width}
            height={data.image.height}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        </div>
      )}

      <div
        className={cn(
          "container-md flex flex-col items-center justify-center gap-6 py-24 text-center text-dark lg:items-start lg:px-12 lg:text-left",
          { "border-solid border-dark lg:border-l-[1px]": !reverse },
        )}
      >
        {data.title && (
          <h2 className="text-3xl text-dark lg:text-4xl">{data.title}</h2>
        )}
        {data.subtitle && (
          <h3 className="text-2xl text-dark-foreground lg:text-3xl">
            {data.subtitle}
          </h3>
        )}
        {data.content && (
          <p className="mt-4 max-w-[548px] text-lg leading-7 text-dark-foreground lg:leading-8">
            {data.content}
          </p>
        )}
        {data.linkButton?.href && (
          <Button
            size={"default"}
            variant={"ghost"}
            asChild
            className="flex gap-2 p-0 text-lg hover:bg-transparent hover:text-primary"
          >
            <Link href={data.linkButton.href}>
              {data.linkButton?.text}
              <ArrowRightIcon style={{ width: "20px", height: "20px" }} />
            </Link>
          </Button>
        )}
      </div>
    </section>
  );
};

export default Page;
