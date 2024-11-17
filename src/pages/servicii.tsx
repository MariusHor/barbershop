import { useEffect, useState } from "react";
import { ArrowRightIcon } from "@radix-ui/react-icons";
import {
  type GetServerSidePropsContext,
  type InferGetServerSidePropsType,
} from "next";
import Head from "next/head";

import { type NextPageWithLayout } from "./_app";
import { api } from "@/utils/api";
import { type PageSectionData } from "@/utils/types";
import { getSSGHelper } from "@/utils/getSSGHelper";
import { usePageSectionsData } from "@/hooks/use-page-sections-data";
import { urlFor } from "@/lib/sanity/client";
import {
  AppointmentsButton,
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  AspectRatio,
  ButtonLink,
  Text,
  CustomPortableText,
  CustomImage,
  MarqueeText,
  Container,
  Flex,
  Grid,
  Section,
} from "@/components";
import { usePageMetadata } from "@/hooks/use-page-metadata";

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
  const { title, description } = usePageMetadata();
  const { heroSectionData, servicesSectionData } = usePageSectionsData();

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
      </Head>

      <HeroSection data={heroSectionData} />
      <ServicesSection data={servicesSectionData} />
    </>
  );
};

const HeroSection = ({ data }: { data: PageSectionData | undefined }) => {
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
            gap="2"
            heightFull
          >
            <Text variant={"h1"}>{data?.title}</Text>
            <Text variant={"h5"} className="mt-2">
              {data?.subtitle}
            </Text>
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

        <MarqueeText className="!absolute bottom-0 z-40 h-header border-t-[1px] border-solid border-border bg-white py-6 md:h-header-md">
          {data?.sectionSpecific?.marqueeText
            ?.split(" | ")
            .map((part, index) => (
              <Text
                key={index}
                variant={"body"}
                className="mx-20 !text-xl lg:mx-40"
              >
                {part}
              </Text>
            ))}
        </MarqueeText>
      </Grid>
    </Section>
  );
};

const ServicesSection = ({ data }: { data: PageSectionData }) => {
  const { data: servicesListData } = api.content.getServicesData.useQuery();

  return (
    <Section
      className="flex min-h-screen bg-primary-foreground"
      id="lista-completa"
    >
      <Container className="flex grow py-[184px]">
        <Flex
          direction="col"
          items="center"
          gap="7"
          justify="center"
          className="grow"
        >
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
                className="border-b-border"
              >
                <AccordionTrigger className="pb-4 pt-0 hover:text-primary hover:no-underline">
                  <div className="flex flex-col text-left">
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
                        <CustomImage
                          width={504}
                          height={504}
                          src={urlFor(service.image).url()}
                          alt={service.name}
                          className="border-2 border-border"
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
