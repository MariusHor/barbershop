import { type InferGetServerSidePropsType } from "next";
import Head from "next/head";

import type { NextPageWithLayout } from "./_app";
import { getPageTitle } from "@/utils/helpers";
import { getSSGHelper } from "@/utils/getSSGHelper";
import { PAGE_ROUTES } from "@/utils/constants";
import { api } from "@/utils/api";
import Image from "next/image";
import { urlFor } from "@/lib/sanity/client";
import { ScheduleButton } from "@/components";

export const getServerSideProps = async () => {
  const ssg = getSSGHelper();

  await Promise.all([
    ssg.content.getHeroImage.prefetch(),
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
  const { data: heroImage } = api.content.getHeroImage.useQuery();
  const pageName = PAGE_ROUTES.home.name;

  return (
    <>
      <Head>
        <title>{getPageTitle(pageName, siteSettings?.title)}</title>
        <meta name="description" content={siteSettings?.description} />
      </Head>
      <div className="hero relative flex w-full flex-col items-center justify-center bg-black">
        {heroImage?.imgUrl ? (
          <Image
            src={urlFor(heroImage?.imgUrl).url()}
            alt={"hero image"}
            width={heroImage?.width}
            height={heroImage?.height}
            className="absolute left-0 top-0 h-full w-full object-cover opacity-40"
            priority
          />
        ) : null}

        <div className="flex max-w-3xl flex-col items-center gap-4">
          <h1 className="z-10 text-center text-8xl font-bold text-white opacity-100">
            Barbershop-ul tau in Iasi
          </h1>
          <ScheduleButton
            className="z-10"
            text="Fa o programare"
            variant={"secondary"}
          />
        </div>
      </div>
    </>
  );
};

export default Page;
