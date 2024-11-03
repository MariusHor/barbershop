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
import { Text } from "@/components/ui/text";

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

      <StayInTouch className="bg-primary-foreground" />
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
        <Text variant={"h2"}>{data?.title}</Text>

        <Text variant={"h4"}>{data?.subtitle}</Text>

        <Text variant={"body"} className="max-w-[624px] px-4">{data?.content}</Text>

        <div className="flex flex-col items-center gap-4 lg:gap-0">
          <ButtonLink
            href={data?.linkButton?.href}
            variant={"ghost"}
            className="flex gap-2"
          >
            {data?.linkButton?.text}
            <ArrowRightIcon style={{ width: "20px", height: "20px" }} />
          </ButtonLink>
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
                  <div className="absolute bottom-0 left-1 right-0 flex justify-between p-4">
                    <span className="absolute inset-0 z-0 bg-black opacity-50"></span>
                    <Text
                      variant={"caption"}
                      as={"span"}
                      className="relative z-10 !text-lg italic text-muted"
                    >
                      {item.name}
                    </Text>
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

      <Marquee
        autoFill
        pauseOnHover
        className="!absolute bottom-0 z-40 h-[calc(var(--header-height)_-24px)] max-w-[100vw] border-t-[1px] border-solid border-secondary-foreground bg-white py-6 md:h-header"
      >
        <SiteLogo size={"sm"} />
        <Text variant={"body"} className="ml-4 mr-40 !text-2xl">
          - {capitalize(currentRoute?.slice(1) ?? "")}
        </Text>
      </Marquee>
    </section>
  );
};

const ServicesSection = () => {
  const { data } = api.content.getServicesData.useQuery();

  return (
    <section id="lista" className="bg-primary-foreground">
      <div className="m-auto flex max-w-[1048px] flex-col items-center gap-24 px-4 pb-8 pt-28">
        <Text variant={"h2"} className="max-w-[1024px]">
          Lista servicii
        </Text>

        <Accordion
          type="single"
          collapsible
          className="flex w-full flex-col gap-4 lg:gap-8"
        >
          {data?.map((service) => (
            <AccordionItem
              key={service.name}
              value={service.name}
              className="border-b-secondary-foreground"
            >
              <AccordionTrigger className="pb-4 pt-0 hover:text-primary hover:no-underline lg:pb-8">
                <div className="flex flex-col text-start">
                  <Text variant={"h4"} as="span">
                    {service.name}
                  </Text>
                  <Text variant={"caption"} as="span" className="italic">
                    {service.price} RON
                  </Text>
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
                            <Text variant={"body"} className="mb-4 lg:mb-8">
                              {children}
                            </Text>
                          ),
                        },
                      }}
                    />
                    <ul className="list-inside list-disc text-base sm:text-lg">
                      {service.details.map((detail, index) => (
                        <li key={index}>
                          <Text variant={"body"} as="span">
                            {detail}
                          </Text>
                        </li>
                      ))}
                    </ul>

                    <Text variant={"body"} className="mt-4 lg:mt-8">
                      Durata: {service.duration} minute
                    </Text>

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
