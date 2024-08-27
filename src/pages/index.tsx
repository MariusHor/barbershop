import { type InferGetServerSidePropsType } from "next";
import Head from "next/head";
import { type Page } from "sanity.types";
import Image from "next/image";

import type { NextPageWithLayout } from "./_app";
import { getPageTitle } from "@/utils/helpers";
import { getSSGHelper } from "@/utils/getSSGHelper";
import { api } from "@/utils/api";
import { type PageSection } from "@/utils/types";
import { urlFor } from "@/lib/sanity/client";
import { ScheduleButton } from "@/components";

export const getServerSideProps = async () => {
  const ssg = getSSGHelper();

  await Promise.all([
    ssg.content.getPageData.prefetch({ slug: "acasa" }),
    ssg.content.getSiteSettings.prefetch(),
    ssg.content.getSiteLogo.prefetch(),
    ssg.content.getShopLocation.prefetch(),
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
      <HeroSection data={pageData.sections[0]} />
    </>
  );
};

const HeroSection = ({ data }: { data: PageSection | undefined }) => {
  if (!data) return null;

  const heroImage = data?.image;

  return (
    <section className="hero relative flex w-full flex-col items-center justify-center bg-black">
      {heroImage ? (
        <Image
          src={urlFor(heroImage).url()}
          alt={heroImage.alt ?? "hero image"}
          width={heroImage.width}
          height={heroImage.height}
          className="absolute left-0 top-0 h-full w-full object-cover opacity-40"
          priority
        />
      ) : null}

      <div className="flex max-w-3xl flex-col items-center gap-4">
        <h1 className="z-10 text-center text-8xl font-bold text-white opacity-100">
          {data?.title}
        </h1>
        <ScheduleButton
          className="z-10"
          text={data?.ctaButtonText}
          variant={"secondary"}
        />
      </div>
    </section>
  );
};

export default Page;
