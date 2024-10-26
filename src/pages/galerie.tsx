import { type InferGetServerSidePropsType } from "next";
import { type NextPageWithLayout } from "./_app";
import Head from "next/head";

import { api } from "@/utils/api";
import { getPageTitle } from "@/utils/helpers";
import { getSSGHelper } from "@/utils/getSSGHelper";
import { ColumnSection, Gallery, RowSection } from "@/components";
import { urlFor } from "@/lib/sanity/client";

export const getServerSideProps = async () => {
  const ssg = getSSGHelper();

  await Promise.all([
    ssg.content.getGalleryImages.prefetch({
      end: 6,
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

  const { data: galleryImages } = api.content.getGalleryImages.useQuery(
    { end: 6 },
    { enabled: !!pageData.sections.some((section) => section.withGallery) },
  );
  const _galleryImages =
    galleryImages?.map((item) => ({
      src: urlFor(item.image).url(),
      width: item.image.width ?? 0,
      height: item.image.height ?? 0,
    })) ?? [];

  return (
    <>
      <Head>
        <title>{getPageTitle(pageData?.title, siteSettings?.title)}</title>
        <meta name="description" content={siteSettings?.description} />
      </Head>

      <div>
        {pageData.sections.map((section, index) =>
          section.style.includes("column") ? (
            <ColumnSection key={index} data={section}>
              {section.withGallery
                ? ({ width }) => <Gallery width={width} data={_galleryImages} />
                : undefined}
            </ColumnSection>
          ) : (
            <RowSection
              key={index}
              data={section}
              className={
                section.style.includes("reversed")
                  ? "border-b-[1px] border-t-[1px]"
                  : "border-b-[1px]"
              }
              reverse={section.style.includes("reversed")}
              maxHeight="100vh"
              titleClassName="text-4xl text-dark font-bold lg:text-5xl"
              imageContainerClassName="order-0"
            />
          ),
        )}
      </div>
    </>
  );
};

export default Page;
