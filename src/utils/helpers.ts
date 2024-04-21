import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { DEFAULT_WEBSITE_SETTINGS } from "./constants";

export function getPageTitle(pageName: string, websiteTitle?: string) {
  return `${pageName} | ${websiteTitle ?? DEFAULT_WEBSITE_SETTINGS.title}`;
}

export function capitalize(input: string) {
  return input.slice(0, 1).toUpperCase() + input.slice(1);
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
