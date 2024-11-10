import { api } from "@/utils/api";
import { type PageSectionContent, type PageSectionType } from "@/utils/types";
import { usePathname } from "next/navigation";
import { type Page } from "sanity.types";

type usePageSectionsDataReturn = Record<
  `${PageSectionType}SectionData`,
  PageSectionContent
> & { pageData: Page };

export function usePageSectionsData() {
  const pathname = usePathname();
  const slug = pathname?.slice(1);

  const { data: pageData } = api.content.getPageData.useQuery(
    !slug ? { isIndex: true } : { slug },
  );

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
