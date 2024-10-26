import { type InferGetServerSidePropsType } from "next";
import { type NextPageWithLayout } from "./_app";
import Head from "next/head";

import { api } from "@/utils/api";
import { cn, getPageTitle } from "@/utils/helpers";
import { getSSGHelper } from "@/utils/getSSGHelper";
import { ColumnSection, RowSection, MainGallery } from "@/components";
import { StayInTouch } from "@/components/common/stay-in-touch";

export const getServerSideProps = async () => {
  const ssg = getSSGHelper();

  await Promise.all([
    ssg.content.getGalleryImages.prefetch({
      limit: 2,
    }),
    ssg.content.getPageData.prefetch({ slug: "galerie" }),
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
    slug: "galerie",
  });

  if (!pageData?.sections?.length) {
    throw new Error("Missing 'Acasa' page Sanity sections data");
  }

  return (
    <>
      <Head>
        <title>{getPageTitle(pageData?.title, siteSettings?.title)}</title>
        <meta name="description" content={siteSettings?.description} />
      </Head>

      {pageData.sections.map((section, index) =>
        section.style.includes("column") ? (
          <ColumnSection
            key={index}
            data={section}
            className="bg-background-secondary !pt-24"
            subTitleClassName="font-black"
          >
            {section.withGallery
              ? ({ width }) => <MainGallery pageData={pageData} width={width} />
              : undefined}
          </ColumnSection>
        ) : (
          <RowSection
            key={index}
            data={section}
            className={cn(
              section.style.includes("reversed")
                ? "border-b-[1px] border-t-[1px]"
                : "border-b-[1px]",
              "h-screen",
            )}
            reverse={section.style.includes("reversed")}
            maxHeight="100vh"
            titleClassName="text-4xl text-dark font-bold lg:text-5xl"
            imageContainerClassName="order-0"
          />
        ),
      )}
      <StayInTouch className="bg-background-secondary" />
    </>
  );
};

export default Page;
