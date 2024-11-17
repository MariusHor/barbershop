import { api } from "@/utils/api";
import { DEFAULT_SITE_SETTINGS } from "@/utils/constants";
import { usePageData } from "./use-page-data";

export const usePageMetadata = () => {
  const { data: siteSettings } = api.content.getSiteSettings.useQuery();
  const { pageData } = usePageData();

  const pageTitle = pageData?.title;
  const siteTitle = siteSettings?.title ?? DEFAULT_SITE_SETTINGS.title;

  return {
    title: `${pageTitle ? `${pageTitle} | ` : ""}${siteTitle}`,
    description: siteSettings?.description,
  };
};
