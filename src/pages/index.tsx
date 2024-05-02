import { type InferGetServerSidePropsType } from "next";
import Head from "next/head";

import type { NextPageWithLayout } from "./_app";
import { getPageTitle } from "@/utils/helpers";
import { getSSGHelper } from "@/utils/getSSGHelper";
import { PAGE_ROUTES } from "@/utils/constants";
import { api } from "@/utils/api";

export const getServerSideProps = async () => {
  const ssg = getSSGHelper();

  await Promise.all([
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
  const pageName = PAGE_ROUTES.home.name;

  return (
    <>
      <Head>
        <title>{getPageTitle(pageName, siteSettings?.title)}</title>
        <meta name="description" content={siteSettings?.description} />
      </Head>
      <div className="hero grid w-full place-items-center">
        <h1>Sergiu Barbershop</h1>
      </div>
    </>
  );
};

export default Page;
