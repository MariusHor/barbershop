import { type Rule } from "@sanity/types";
import { SANITY_DOC_TYPES } from "../utils/constants";

const siteSettings = {
  name: SANITY_DOC_TYPES.siteSettings,
  type: "document",
  title: "Setari website",
  fields: [
    {
      name: "title",
      type: "string",
      title: "Titlu website",
      validation: (rule: Rule) => rule.required().min(10).max(50),
    },
    {
      name: "description",
      type: "text",
      title: "Descriere website",
      validation: (rule: Rule) => rule.required().min(20),
    },
    {
      name: "scheduleLink",
      type: "url",
      title: "Link programari",
      validation: (rule: Rule) => rule.required().min(20),
    },
  ],
};

export default siteSettings;
