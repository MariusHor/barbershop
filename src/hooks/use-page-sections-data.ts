import { type Page } from "sanity.types";
import { type PageSectionData, type PageSectionType } from "@/utils/types";
import { usePageData } from "./use-page-data";

type usePageSectionsDataReturn = Record<
  `${PageSectionType}SectionData`,
  PageSectionData
> & { pageData: Page };

export function usePageSectionsData() {
  const { pageData } = usePageData();

  if (!pageData?.sections?.length) {
    throw new Error(`Missing '${pageData?.title}' page Sanity sections data`);
  }

  return pageData?.sections.reduce(
    (accumulator, section) => ({
      ...accumulator,
      [`${section.type}SectionData`]: section.content,
    }),
    { pageData } as usePageSectionsDataReturn,
  );
}
