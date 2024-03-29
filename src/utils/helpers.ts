import { WEBSITE_TITLE } from "./constants";

export function getPageTitle(page: string) {
  return `${page} | ${WEBSITE_TITLE}`;
}
