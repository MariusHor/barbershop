import {
  type GetServerSidePropsContext,
  type InferGetServerSidePropsType,
} from "next";
import { type NextPageWithLayout } from "./_app";
import Head from "next/head";

import { api } from "@/utils/api";
import { capitalize, getPageTitle } from "@/utils/helpers";
import { getSSGHelper } from "@/utils/getSSGHelper";
import { SiteLogo, AppointmentsButton } from "@/components";
import { usePathname } from "next/navigation";
import { ArrowRightIcon } from "@radix-ui/react-icons";
import Image from "next/image";
import { urlFor } from "@/lib/sanity/client";
import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { FollowSection } from "@/components/common/follow-section";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { ButtonLink } from "@/components/common/button-link";
import { Text } from "@/components/ui/text";
import { type PageSectionContent } from "@/utils/types";
import CustomPortableText from "@/components/common/custom-portable-text";
import MarqueeText from "@/components/common/marquee-text";
import { Container, Flex, Grid, Section } from "@/components/ui/layout";
import CustomImage from "@/components/common/custom-image";
import { useEffect, useState } from "react";
import { usePageSectionsData } from "@/composables/usePageSectionsData";

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
) => {
  const slug = context.resolvedUrl.slice(1);
  const ssg = getSSGHelper();

  await Promise.all([
    ssg.content.getPageData.prefetch({ slug }),
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
  const { heroSectionData, servicesSectionData, pageData } =
    usePageSectionsData();
  const { data: siteSettings } = api.content.getSiteSettings.useQuery();

  return (
    <>
      <Head>
        <title>{getPageTitle(pageData?.title, siteSettings?.title)}</title>
        <meta name="description" content={siteSettings?.description} />
      </Head>

      <HeroSection data={heroSectionData} />
      <ServicesSection data={servicesSectionData} />

      <FollowSection className="bg-primary-foreground" />
    </>
  );
};

const HeroSection = ({ data }: { data: PageSectionContent | undefined }) => {
  const currentRoute = usePathname();
  const { data: servicesData } = api.content.getServicesData.useQuery();
  const imagesData = servicesData?.map((service) => ({
    image: service.image,
    name: service.name,
  }));
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  const [currentHeroImageTitle, setCurrentHeroImageTitle] = useState(
    imagesData?.[0]?.name,
  );

  useEffect(() => {
    if (!carouselApi) {
      return;
    }

    carouselApi.on("select", () => {
      const nextIndex = carouselApi.selectedScrollSnap();
      const nextHeroImageTitle = imagesData?.[nextIndex]?.name;
      setCurrentHeroImageTitle(nextHeroImageTitle);
    });
  }, [carouselApi, imagesData]);

  return (
    <Section className="relative" heightScreen>
      <Grid
        cols={{
          base: 1,
          lg: 2,
        }}
        heightFull
        className="py-[var(--header-h)] md:py-[var(--header-h-md)]"
      >
        <Container className="text-center" heightFull>
          <Flex
            direction="col"
            items="center"
            justify="center"
            gap="4"
            heightFull
          >
            <Text variant={"h1"}>{data?.title}</Text>
            <Text variant={"h4"}>{data?.subtitle}</Text>
            <CustomPortableText value={data?.text} />
            <Flex
              className="mt-4 lg:mt-8"
              direction="col"
              items="center"
              justify="center"
              gap="2"
            >
              <ButtonLink
                href={data?.sectionSpecific?.linkButton?.href}
                variant={"ghost"}
                size={"default"}
                className="flex gap-2"
              >
                {data?.sectionSpecific?.linkButton?.text}
                <ArrowRightIcon style={{ width: "20px", height: "20px" }} />
              </ButtonLink>
              <AppointmentsButton />
            </Flex>
          </Flex>
        </Container>

        <Carousel className="hidden bg-black lg:block" setApi={setCarouselApi}>
          <CarouselContent className="relative -ml-1 h-full">
            {imagesData?.map((item, index) => (
              <CarouselItem key={index} className="h-full pl-1">
                <CustomImage
                  src={item.image}
                  alt={item.name}
                  className="z-0 h-full w-full select-none object-cover grayscale"
                  width={984}
                  height={984}
                  priority
                  loading="eager"
                />
              </CarouselItem>
            ))}
          </CarouselContent>

          <Flex
            className="absolute bottom-0 left-0 right-0 p-4"
            justify="between"
          >
            <span className="absolute inset-0 z-0 bg-black opacity-50"></span>
            <Text
              variant={"caption"}
              as={"span"}
              className="relative z-10 !text-lg italic text-muted"
            >
              {currentHeroImageTitle}
            </Text>
            <Flex gap={"4"}>
              <CarouselPrevious className="relative left-0 text-foreground" />
              <CarouselNext className="relative right-0 text-foreground" />
            </Flex>
          </Flex>
        </Carousel>

        <MarqueeText className="!absolute bottom-0 z-40 h-header border-t-[1px] border-solid border-secondary-foreground bg-white py-6 md:h-header-md">
          <SiteLogo size={"sm"} />
          <Text variant={"body"} className="ml-4 mr-40 !text-2xl">
            - {capitalize(currentRoute?.slice(1) ?? "")}
          </Text>
        </MarqueeText>
      </Grid>
    </Section>
  );
};

const ServicesSection = ({ data }: { data: PageSectionContent }) => {
  const { data: servicesListData } = api.content.getServicesData.useQuery();

  return (
    <Section className="bg-primary-foreground" id="lista-completa">
      <Container className="py-16">
        <Flex direction="col" items="center" gap="7">
          <Text variant="h2">{data?.title}</Text>
          <Text variant="h5">{data?.subtitle}</Text>
          <CustomPortableText value={data?.text} />

          <Accordion
            type="single"
            collapsible
            className="flex w-full flex-col gap-4 lg:gap-8"
          >
            {servicesListData?.map((service) => (
              <AccordionItem
                key={service._id}
                value={service.name}
                className="border-b-secondary-foreground"
              >
                <AccordionTrigger className="pb-4 pt-0 hover:text-primary hover:no-underline">
                  <div className="flex flex-col text-start">
                    <Text variant={"h6"} className="font-normal">
                      {service.name}
                    </Text>
                    <Text variant={"caption"} as="span" className="italic">
                      {service.price} RON
                    </Text>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="flex flex-col gap-2 pb-4 text-left">
                  <div className="grid-cols-2 gap-8 lg:grid">
                    <div>
                      <CustomPortableText value={service.description} />
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

                      <AppointmentsButton
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
        </Flex>
      </Container>
    </Section>
  );
};

export default Page;
