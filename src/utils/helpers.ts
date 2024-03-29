import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

import { WEBSITE_TITLE } from "./constants";

export function getPageTitle(page: string) {
  return `${page} | ${WEBSITE_TITLE}`;
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
