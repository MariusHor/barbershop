import { type InferGetServerSidePropsType } from "next";
import { type NextPageWithLayout } from "./_app";
import Head from "next/head";

import { api } from "@/utils/api";
import { capitalize, getPageTitle } from "@/utils/helpers";
import { getSSGHelper } from "@/utils/getSSGHelper";
import { SiteLogo, ScheduleButton } from "@/components";
import Marquee from "react-fast-marquee";
import { usePathname } from "next/navigation";
import { ArrowRightIcon } from "@radix-ui/react-icons";
import Image from "next/image";
import { urlFor } from "@/lib/sanity/client";
import { PortableText } from "@portabletext/react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { StayInTouch } from "@/components/common/stay-in-touch";
import { type Page as PageData } from "sanity.types";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { ButtonLink } from "@/components/common/button-link";

export const getServerSideProps = async () => {
  const ssg = getSSGHelper();

  await Promise.all([
    ssg.content.getPageData.prefetch({ slug: "servicii" }),
    ssg.content.getServicesData.prefetch(),
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

  if (!pageData?.sections?.length) {
    throw new Error("Missing 'Servicii' page Sanity sections data");
  }

  const introSectionData = pageData?.sections?.find(
    (section) => section.value === "intro",
  );

  return (
    <>
      <Head>
        <title>{getPageTitle(pageData?.title, siteSettings?.title)}</title>
        <meta name="description" content={siteSettings?.description} />
      </Head>

      <IntroSection data={introSectionData} />

      <ServicesSection />

      <StayInTouch className="bg-primary-foreground"/>
    </>
  );
};

const IntroSection = ({
  data,
}: {
  data: NonNullable<PageData["sections"]>[number] | undefined;
}) => {
  const currentRoute = usePathname();
  const { data: servicesData } = api.content.getServicesData.useQuery();
  const imagesData = servicesData?.map((service) => ({
    image: service.image,
    name: service.name,
  }));

  return (
    <section className="relative mt-[var(--header-height)] grid h-[calc(100vh_-var(--header-height))] w-full overflow-hidden lg:grid-cols-2">
      <div className="relative z-40 flex h-[calc(100vh_-var(--header-height)*_2)] flex-col items-center justify-center gap-4 px-4 text-center lg:gap-8 lg:px-0">
        {data?.title && (
          <h1 className="text-3xl font-black sm:text-4xl md:text-5xl xl:text-6xl">
            {data?.title}
          </h1>
        )}

        {data?.subtitle && (
          <h2 className="max-w-[736px] text-center text-base text-dark-foreground md:text-lg xl:text-xl">
            {data?.subtitle}
          </h2>
        )}

        <div className="flex flex-col items-center gap-2 lg:gap-0">
          {data?.linkButton?.href && (
            <ButtonLink
              href={data.linkButton.href}
              variant={"ghost"}
              className="flex gap-2"
            >
              {data.linkButton?.text}
              <ArrowRightIcon style={{ width: "20px", height: "20px" }} />
            </ButtonLink>
          )}
          <ScheduleButton className="xl:mt-4" />
        </div>
      </div>
      <div className="hidden h-[calc(100vh_-var(--header-height)*_2)] flex-col items-center justify-center gap-16 bg-white lg:flex">
        <div className="relative z-10 h-full w-full select-none overflow-hidden">
          <Carousel className="h-full">
            <CarouselContent className="-ml-1 h-full">
              {imagesData?.map((item, index) => (
                <CarouselItem key={index} className="relative h-full pl-1">
                  <Image
                    src={urlFor(item.image).url()}
                    alt={item.name}
                    className="relative z-0 h-full w-full select-none object-cover grayscale"
                    width={984}
                    height={984}
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
          <SiteLogo size={"sm"} />
          <span className="font-500 ml-4 mr-40 text-3xl">
            - {capitalize(currentRoute?.slice(1) ?? "")}
          </span>
        </Marquee>
      </div>
    </section>
  );
};

const ServicesSection = () => {
  const { data } = api.content.getServicesData.useQuery();

  return (
    <section id="lista" className="bg-primary-foreground">
      <div className="m-auto flex max-w-[1048px] flex-col items-center gap-24 px-4 pb-8 pt-28">
        <h3 className="max-w-[1024px] text-center text-2xl font-black text-dark-foreground md:text-3xl lg:text-4xl">
          Lista completa
        </h3>
        <Accordion
          type="single"
          collapsible
          className="flex w-full flex-col gap-4 lg:gap-8"
        >
          {data?.map((service) => (
            <AccordionItem
              key={service.name}
              value={service.name}
              className="border-b-muted-foreground"
            >
              <AccordionTrigger className="pb-4 pt-0 hover:text-primary hover:no-underline lg:pb-8">
                <div className="flex flex-col text-start">
                  <span className="text-2xl">{service.name}</span>
                  <span className="text-sm italic">{service.price} RON</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="flex flex-col gap-2 pb-4 text-left lg:pb-8">
                <div className="grid-cols-2 gap-8 lg:grid">
                  <div>
                    <PortableText
                      value={service.description}
                      components={{
                        block: {
                          normal: ({ children }) => (
                            <p className="mb-4 text-base sm:text-lg lg:mb-8">
                              {children}
                            </p>
                          ),
                        },
                      }}
                    />
                    <ul className="list-inside list-disc text-base sm:text-lg">
                      {service.details.map((detail, index) => (
                        <li key={index}>{detail}</li>
                      ))}
                    </ul>

                    <p className="mt-4 text-base sm:text-lg lg:mt-8">
                      Durata: {service.duration} minute
                    </p>

                    <ScheduleButton
                      variant={"outline"}
                      className="mt-4 lg:mt-8"
                    />
                  </div>
                  <div className="hidden lg:block">
                    <AspectRatio ratio={16 / 9}>
                      <Image
                        width={504}
                        height={504}
                        src={urlFor(service.image).url()}
                        alt={service.name}
                      />
                    </AspectRatio>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export default Page;
