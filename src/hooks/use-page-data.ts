import { api } from "@/utils/api";
import { usePathname } from "next/navigation";

export const usePageData = () => {
  const pathname = usePathname();
  const slug = pathname?.slice(1);

  const { data: pageData } = api.content.getPageData.useQuery(
    !slug ? { isIndex: true } : { slug },
  );

  return { pageData };
};
