import { useEffect } from "react";
import { type AppProps } from "next/app";
import { type NextPage } from "next";
import { Work_Sans } from "next/font/google";
import Head from "next/head";

import { api } from "@/utils/api";
import "@/styles/globals.css";
import { MainLayout } from "@/layouts";
import { useStore } from "@/store";
import { cn } from "@/utils/helpers";

const workSans = Work_Sans({
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
  const menuOpen = useStore((state) => state.menuOpen);
  const BODY_CLASS = "overflow-hidden";

  useEffect(() => {
    if (menuOpen) {
      document.body.classList.add(BODY_CLASS);
    } else {
      document.body.classList.remove(BODY_CLASS);
    }

    return () => {
      document.body.classList.remove(BODY_CLASS);
    };
  }, [menuOpen]);

  return (
    <>
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>

      <div className={cn("flex min-h-screen flex-col", workSans.className)}>
        <MainLayout>{getLayout(<Component {...pageProps} />)}</MainLayout>
      </div>
    </>
  );
};

export default api.withTRPC(MyApp);
