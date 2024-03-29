import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

import { WEBSITE_TITLE } from "./constants";

export function getPageTitle(page: string) {
  return `${page} | ${WEBSITE_TITLE}`;
}

export function capitalize(input: string) {
  return input.slice(0, 1).toUpperCase() + input.slice(1);
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
