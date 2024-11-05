import { type InferGetServerSidePropsType } from "next";
import { type NextPageWithLayout } from "./_app";
import Head from "next/head";

import { api } from "@/utils/api";
import { getPageTitle } from "@/utils/helpers";
import { getSSGHelper } from "@/utils/getSSGHelper";
import { ColumnSection, RowSection, GalleryPhotoAlbum } from "@/components";
import { StayInTouch } from "@/components/common/follow-section";

export const getServerSideProps = async () => {
  const ssg = getSSGHelper();

  await Promise.all([
    ssg.content.getGalleryImages.prefetch({
      limit: 10,
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
    throw new Error("Missing 'Galerie' page Sanity sections data");
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
            className="bg-secondary !pt-24"
          >
            {section.withGallery
              ? ({ width }) => <GalleryPhotoAlbum width={width} />
              : undefined}
          </ColumnSection>
        ) : (
          <RowSection
            key={index}
            data={section}
            className="h-screen pt-[calc(var(--header-height)_-24px)] md:pt-[var(--header-height)]"
            reverse={section.style.includes("reversed")}
            maxHeight="100vh"
          />
        ),
      )}
      <StayInTouch className="bg-secondary" />
    </>
  );
};

export default Page;
