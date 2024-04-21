import { type InferGetServerSidePropsType } from "next";
import Head from "next/head";

import type { NextPageWithLayout } from "./_app";
import { getPageTitle } from "@/utils/helpers";
import { getSSGHelper } from "@/utils/getSSGHelper";
import { PAGE_ROUTES } from "@/utils/constants";

export const getServerSideProps = async () => {
  const ssg = getSSGHelper();

  const siteSettings = await ssg.content.getSiteSettings.fetch();
  await ssg.content.getSiteLogo.prefetch();
  await ssg.content.getShopLocation.prefetch();

  return {
    props: {
      trpcState: ssg.dehydrate(),
      siteSettings,
    },
  };
};

const Page: NextPageWithLayout<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ siteSettings }) => {
  const pageName = PAGE_ROUTES.home.name;

  return (
    <>
      <Head>
        <title>{getPageTitle(pageName, siteSettings?.title)}</title>
        <meta name="description" content={siteSettings?.description} />
      </Head>
      <div className="grid w-full place-items-center"></div>
    </>
  );
};

export default Page;
