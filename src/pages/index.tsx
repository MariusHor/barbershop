import Head from "next/head";

import type { NextPageWithLayout } from "./_app";
import { getPageTitle } from "@/utils/helpers";

const Page: NextPageWithLayout = () => {
  return (
    <>
      <Head>
        <title>{getPageTitle("Home")}</title>
        <meta name="description" content="Sergiu Barbershop" />
      </Head>
      <div className="grid w-full place-items-center">HOME</div>
    </>
  );
};

export default Page;
