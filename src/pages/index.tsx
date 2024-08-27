import { type InferGetServerSidePropsType } from "next";
import Head from "next/head";
import { type Page } from "sanity.types";
import Image from "next/image";
import { ArrowRightIcon } from "@radix-ui/react-icons";

import type { NextPageWithLayout } from "./_app";
import { getPageTitle } from "@/utils/helpers";
import { getSSGHelper } from "@/utils/getSSGHelper";
import { api } from "@/utils/api";
import { type PageSection } from "@/utils/types";
import { urlFor } from "@/lib/sanity/client";
import { ScheduleButton } from "@/components";
import { Button } from "@/components/ui/button";
import Link from "next/link";

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
      <HeroSection data={pageData.sections[0] as PageSection} />
    </>
  );
};

const HeroSection = ({ data }: { data: PageSection }) => {
  const heroImage = data?.image;

  return (
    <section className="hero relative flex w-full flex-col items-center justify-center bg-black">
      {heroImage && (
        <Image
          src={urlFor(heroImage).url()}
          alt={heroImage.alt ?? "hero image"}
          width={heroImage.width}
          height={heroImage.height}
          className="absolute left-0 top-0 h-full w-full object-cover opacity-40"
          priority
        />
      )}

      <div className="container-lg z-10 flex max-w-3xl flex-col items-center gap-4">
        <h1 className="text-center text-4xl font-bold text-white opacity-100 sm:text-5xl md:text-6xl lg:text-7xl 2xl:text-8xl">
          {data.title}
        </h1>

        {data?.subtitle && (
          <p className="max-w-[736px] text-center text-lg text-white opacity-100 sm:text-xl md:text-2xl xl:text-3xl">
            {data?.subtitle}
          </p>
        )}

        <div className="mt-8 flex flex-col items-center justify-center gap-6 md:flex-row">
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
        </div>
      </div>
    </section>
  );
};

export default Page;
