import {
  type GetServerSidePropsContext,
  type InferGetServerSidePropsType,
} from "next";
import { type NextPageWithLayout } from "./_app";
import Head from "next/head";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { api } from "@/utils/api";
import { getPageTitle } from "@/utils/helpers";
import { getSSGHelper } from "@/utils/getSSGHelper";
import { Container, Flex, Grid, Section } from "@/components/ui/layout";
import { Text } from "@/components/ui/text";
import { ButtonLink } from "@/components/common/button-link";
import { SiteLogo } from "@/components";
import { ArrowRightIcon } from "@radix-ui/react-icons";
import { type PageSectionContent } from "@/utils/types";
import { usePageSectionsData } from "@/composables/usePageSectionsData";
import CustomPortableText from "@/components/common/custom-portable-text";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
) => {
  const slug = context.resolvedUrl.slice(1);
  const ssg = getSSGHelper();

  await Promise.all([
    ssg.content.getPageData.prefetch({ slug }),
    ssg.content.getFaqData.prefetch(),
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
  const { heroSectionData, faqSectionData, formSectionData, pageData } =
    usePageSectionsData();

  return (
    <>
      <Head>
        <title>{getPageTitle(pageData?.title, siteSettings?.title)}</title>
        <meta name="description" content={siteSettings?.description} />
      </Head>

      <HeroSection data={heroSectionData} />
      <FaqSection data={faqSectionData} />
      <FormSection data={formSectionData} />
    </>
  );
};

const HeroSection = ({ data }: { data: PageSectionContent }) => {
  const { data: locationData } = api.content.getShopLocation.useQuery();
  const { data: siteSettings } = api.content.getSiteSettings.useQuery();

  const phoneNumber = locationData?.phone ?? siteSettings?.phone;
  const email = locationData?.email ?? siteSettings?.email;

  return (
    <Section heightScreen className="bg-white">
      <Container
        heightFull
        className="pt-[var(--header-h)] md:pt-[var(--header-h-md)]"
        size="4"
      >
        <Grid
          cols={{
            base: 1,
            lg: 2,
          }}
          items="center"
          heightFull
          className="py-8"
        >
          <Flex
            heightFull
            items="center"
            justify="center"
            direction="col"
            className="border-solid lg:items-start lg:border-r-[1px]"
          >
            <div className="mb-8">
              <Text variant={"h1"} className="text-center lg:text-left">
                {data?.title}
              </Text>
              <Text variant={"h4"} className="text-center lg:text-left">
                {data?.subtitle}
              </Text>
            </div>

            <Flex direction="col" items="center" className="lg:items-start">
              <ButtonLink href={`phone:${phoneNumber}`}>
                <Text variant={"body"} className="!mt-0">
                  {phoneNumber}
                </Text>
              </ButtonLink>
              <ButtonLink href={`mail:${email}`}>
                <Text variant={"body"} className="!mt-0">
                  {email}
                </Text>
              </ButtonLink>
            </Flex>

            <Flex
              direction="col"
              className="mt-8 lg:items-start"
              items="center"
            >
              <Text variant={"body"}>{locationData?.street}</Text>
              <Text variant={"body"} className="!mt-0">
                {locationData?.zip} {locationData?.city}
              </Text>
              <ButtonLink
                variant={"ghost"}
                className="flex w-fit gap-2"
                href={
                  data?.sectionSpecific?.linkButton?.href ??
                  locationData?.locationUrl ??
                  siteSettings?.locationUrl
                }
              >
                {data?.sectionSpecific?.linkButton?.text}
                <ArrowRightIcon style={{ width: "20px", height: "20px" }} />
              </ButtonLink>
            </Flex>
          </Flex>
          <SiteLogo className="hidden h-fit w-full max-w-[50px] justify-self-end sm:max-w-[60px] md:max-w-[270px] lg:block" />
        </Grid>
      </Container>
    </Section>
  );
};

const FaqSection = ({ data }: { data: PageSectionContent }) => {
  const { data: faqListData } = api.content.getFaqData.useQuery();

  if (!faqListData) return null;

  return (
    <Section className="bg-primary-foreground" id="lista-completa">
      <Container className="py-16">
        <Flex direction="col" items="center" gap="7">
          <div className="text-center">
            <Text variant={"h2"}>{data?.title}</Text>
            <Text variant={"h5"}>{data?.subtitle}</Text>
          </div>
          <CustomPortableText value={data?.text} />

          <Accordion
            type="single"
            collapsible
            className="flex w-full flex-col gap-4 lg:gap-8"
          >
            {faqListData?.map((item) => (
              <AccordionItem
                key={item?._id}
                value={item.question}
                className="border-b-secondary-foreground"
              >
                <AccordionTrigger className="pt-0 hover:text-primary hover:no-underline">
                  <Text variant={"h6"} className="font-normal">
                    {item.question}
                  </Text>
                </AccordionTrigger>
                <AccordionContent className="flex flex-col gap-2 pb-0 text-left">
                  <CustomPortableText value={item.answer} />
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Flex>
      </Container>
    </Section>
  );
};

const FormSection = ({ data }: { data: PageSectionContent }) => {
  const formSchema = z.object({
    name: z.string().min(2).max(50),
    email: z.string().min(2).max(50),
    message: z.string().min(2).max(500),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }

  return (
    <Section className="bg-white">
      <Container className="py-16">
        <Flex direction="col" items="center" gap="7">
          <div className="text-center">
            <Text variant={"h2"}>{data?.title}</Text>
            <Text variant={"h5"}>{data?.subtitle}</Text>
          </div>

          <CustomPortableText value={data?.text} />

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="w-full space-y-8"
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Message</FormLabel>
                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">Submit</Button>
            </form>
          </Form>
        </Flex>
      </Container>
    </Section>
  );
};

export default Page;
