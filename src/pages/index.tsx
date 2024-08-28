import { type InferGetServerSidePropsType } from "next";
import Head from "next/head";
import { type Page } from "sanity.types";
import Image from "next/image";

import type { NextPageWithLayout } from "./_app";
import { cn, getPageTitle } from "@/utils/helpers";
import { getSSGHelper } from "@/utils/getSSGHelper";
import { api } from "@/utils/api";
import { type PageSection } from "@/utils/types";
import { urlFor } from "@/lib/sanity/client";
import { ScheduleButton } from "@/components";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export const getServerSideProps = async () => {
  const ssg = getSSGHelper();

  await Promise.all([
    ssg.content.getPageData.prefetch({ slug: "acasa" }),
    ssg.content.getGalleryImages.prefetch({ end: 6 }),
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

  return (
    <>
      <Head>
        <title>{getPageTitle(pageData?.title, siteSettings?.title)}</title>
        <meta name="description" content={siteSettings?.description} />
      </Head>
      <HeroSection data={pageData.sections[0] as PageSection} />
    </>
  );
};

const HeroSection = ({ data }: { data: PageSection }) => {
  const { data: imagesData } = api.content.getGalleryImages.useQuery({
    end: 6,
  });

  const [isImageLoading, setImageLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const selectedImage = imagesData?.[selectedImageIndex];
  const heroImage = data?.image;

  function handleImageSelect(index: number) {
    setSelectedImageIndex(index);
  }

  if (!selectedImage) {
    throw new Error("Missing gallery images");
  }

  return (
    <section className="relative grid h-full w-full bg-black lg:grid-cols-2">
      <div className="relative">
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

        <div className="relative z-50 flex h-full flex-col items-center justify-center gap-16">
          <h1 className="flex gap-4 text-center opacity-100 md:gap-6 xl:gap-8">
            {data.title.split("").map((letter, index) => (
              <Button
                key={index}
                variant={"ghost"}
                className={cn(
                  "p-0 text-6xl font-black text-muted hover:bg-transparent hover:text-primary md:text-8xl 2xl:text-9xl",
                  { "text-primary": index === selectedImageIndex },
                )}
                onClick={() => handleImageSelect(index)}
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

          <ScheduleButton className="bg-white text-dark hover:text-muted lg:hidden" />
        </div>
      </div>

      <div className="hidden flex-col items-center justify-center gap-16 bg-white px-20 lg:flex">
        <div className="aspect-square max-h-[564px] w-full max-w-[564px] border-[1px] border-solid border-dark">
          <Image
            src={selectedImage.imageUrl}
            alt={selectedImage.alt ?? ""}
            width={selectedImage.width}
            height={selectedImage.height}
            className="h-full w-full object-cover"
            priority
          />
        </div>
        {/* <div className="mt-8 flex flex-col items-center justify-center gap-6 md:flex-row">
          {data.ctaButton && <ScheduleButton text={data.ctaButton.text} />}

          {data.linkButton && (
            <Button
              className="font-600 flex gap-2 rounded-none bg-transparent p-0 text-lg text-white hover:text-primary-foreground"
              asChild
            >
              <Link href={data.linkButton.href}>
                {data.linkButton.text}
                <ArrowRightIcon />
              </Link>
            </Button>
          )}
        </div> */}
        <ScheduleButton className="absolute bottom-16" />
      </div>
    </section>
  );
};

export default Page;
