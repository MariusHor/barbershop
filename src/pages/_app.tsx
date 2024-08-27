import * as React from "react";
import { type AppProps } from "next/app";
import { type NextPage } from "next";
import { Source_Sans_3 } from "next/font/google";
import Head from "next/head";

import { api } from "@/utils/api";

import "@/styles/globals.css";
import { MainLayout } from "@/layouts";

const sourceSans3 = Source_Sans_3({
  subsets: ["latin"],
});

export type NextPageWithLayout<P = object, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: React.ReactElement) => React.ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

const MyApp = ({ Component, pageProps }: AppPropsWithLayout) => {
  const getLayout = Component.getLayout ?? ((page) => page);

  return (
    <>
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <div className={`flex min-h-screen flex-col ${sourceSans3.className}`}>
        <MainLayout>{getLayout(<Component {...pageProps} />)}</MainLayout>
      </div>
    </>
  );
};

export default api.withTRPC(MyApp);
