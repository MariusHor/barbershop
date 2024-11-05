import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { DEFAULT_WEBSITE_SETTINGS } from "./constants";
import { type Page } from "sanity.types";

export function getPageTitle(pageName?: string, websiteTitle?: string) {
  return `${pageName ? `${pageName} | ` : ""}${websiteTitle ?? DEFAULT_WEBSITE_SETTINGS.title}`;
}

export const getSectionContent = (pageData: Page, type: string) => {
  return pageData.sections.find((section) => section.type === type)?.content;
};

export function capitalize(input: string) {
  return input.slice(0, 1).toUpperCase() + input.slice(1);
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
