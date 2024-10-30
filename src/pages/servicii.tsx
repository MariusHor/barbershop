import { type InferGetServerSidePropsType } from "next";
import { type NextPageWithLayout } from "./_app";
import Head from "next/head";

import { api } from "@/utils/api";
import { capitalize, getPageTitle } from "@/utils/helpers";
import { getSSGHelper } from "@/utils/getSSGHelper";
import { Logo, ScheduleButton } from "@/components";
import Marquee from "react-fast-marquee";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRightIcon } from "@radix-ui/react-icons";
import Image from "next/image";
import { urlFor } from "@/lib/sanity/client";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export const getServerSideProps = async () => {
  const ssg = getSSGHelper();

  await Promise.all([
    ssg.content.getServicesImages.prefetch({
      limit: 6,
    }),
    ssg.content.getPageData.prefetch({ slug: "servicii" }),
    ssg.content.getSiteSettings.prefetch(),
    ssg.content.getSiteLogo.prefetch(),
    ssg.content.getShopLocation.prefetch(),
    ssg.content.getRoutes.prefetch(),
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
    slug: "servicii",
  });
  const { data: imagesData } = api.content.getServicesImages.useQuery({
    limit: 6,
  });
  const currentRoute = usePathname();

  const introSectionData = pageData?.sections?.find(
    (section) => section.value === "intro",
  );

  return (
    <>
      <Head>
        <title>{getPageTitle(pageData?.title, siteSettings?.title)}</title>
        <meta name="description" content={siteSettings?.description} />
      </Head>

      <section className="relative mt-[var(--header-height)] grid h-[calc(100vh_-var(--header-height))] w-full overflow-hidden bg-background-secondary lg:grid-cols-2">
        <div className="relative z-40 flex h-[calc(100vh_-var(--header-height)*_2)] flex-col items-center justify-center gap-4 px-4 text-center lg:gap-8 lg:px-0">
          {introSectionData?.title && (
            <h1 className="text-3xl font-black sm:text-4xl md:text-5xl xl:text-6xl">
              {introSectionData?.title}
            </h1>
          )}

          {introSectionData?.subtitle && (
            <h2 className="text-md max-w-[736px] text-center text-dark-foreground md:text-lg xl:text-xl">
              {introSectionData?.subtitle}
            </h2>
          )}

          <div className="flex flex-col items-center gap-2 lg:gap-0">
            {introSectionData?.linkButton?.href && (
              <Button
                size={"default"}
                variant={"ghost"}
                asChild
                className="flex gap-2 p-0 text-lg hover:bg-transparent hover:text-primary-foreground"
              >
                <Link
                  href={introSectionData.linkButton.href}
                  target={
                    introSectionData.linkButton.href.includes("https")
                      ? "_blank"
                      : "_self"
                  }
                >
                  {introSectionData.linkButton?.text}
                  <ArrowRightIcon style={{ width: "20px", height: "20px" }} />
                </Link>
              </Button>
            )}
            <ScheduleButton
              variant={"outline"}
              className="bg-primary-foreground text-muted hover:border-muted-foreground hover:bg-background-secondary hover:text-dark xl:mt-4"
            />
          </div>
        </div>
        <div className="hidden h-[calc(100vh_-var(--header-height)*_2)] flex-col items-center justify-center gap-16 bg-white lg:flex">
          <div className="relative z-10 h-full w-full select-none overflow-hidden">
            <Carousel className="h-full bg-background-secondary">
              <CarouselContent className="-ml-1 h-full bg-background-secondary">
                {imagesData?.items?.map((item, index) => (
                  <CarouselItem key={index} className="relative h-full pl-1">
                    <Image
                      src={urlFor(item.image).url()}
                      alt={item.image.alt ?? "hero image"}
                      width={item.image.width}
                      height={item.image.height}
                      className="relative z-0 h-full w-full select-none object-cover grayscale"
                      priority
                    />
                    <div className="absolute bottom-0 left-1 right-0 flex justify-between p-4 text-2xl italic text-muted">
                      <span className="absolute inset-0 z-0 bg-black opacity-50"></span>
                      <span className="relative z-10">{item.name}</span>
                      <div className="flex gap-4">
                        <CarouselPrevious className="relative left-0 text-foreground" />
                        <CarouselNext className="relative right-0 text-foreground" />
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          </div>
        </div>
        <div className="absolute bottom-0 z-40 h-[var(--header-height)] max-w-[100vw] border-t-[1px] border-solid border-muted-foreground bg-white py-6">
          <Marquee autoFill pauseOnHover className="max-w-[100vw]">
            <Logo className="w-16" />
            <span className="font-500 ml-4 mr-40 text-3xl">
              - {capitalize(currentRoute?.slice(1) ?? "")}
            </span>
          </Marquee>
        </div>
      </section>
    </>
  );
};

export default Page;
