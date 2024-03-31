import Head from "next/head";

import type { NextPageWithLayout } from "./_app";
import { getPageTitle } from "@/utils/helpers";
import { getSSGHelper } from "@/utils/getSSGHelper";

export const getServerSideProps = async () => {
  const ssg = getSSGHelper();

  await ssg.content.getLocation.prefetch();

  return {
    props: {
      trpcState: ssg.dehydrate(),
    },
  };
};

const Page: NextPageWithLayout = () => {
  return (
    <>
      <Head>
        <title>{getPageTitle("Home")}</title>
        <meta name="description" content="Sergiu Barbershop" />
      </Head>
      <div className="grid w-full place-items-center"></div>
    </>
  );
};

export default Page;
