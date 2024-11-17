import { type Page } from "sanity.types";

export type PageSectionData = Page["sections"][number]["content"];
export type PageSectionType = Page["sections"][number]["type"];
