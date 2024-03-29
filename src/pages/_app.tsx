import type { ReactElement, ReactNode } from "react";
import { type AppProps } from "next/app";
import { type NextPage } from "next";
import { Inter } from "next/font/google";
import Head from "next/head";

import { api } from "@/utils/api";

import "@/styles/globals.css";
import { MainLayout } from "@/layouts";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export type NextPageWithLayout<P = object, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
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
      <div className={`font-sans ${inter.variable}`}>
        <MainLayout>{getLayout(<Component {...pageProps} />)}</MainLayout>
      </div>
    </>
  );
};

export default api.withTRPC(MyApp);
