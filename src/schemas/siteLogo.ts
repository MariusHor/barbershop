import { type Rule } from "@sanity/types";
import { SANITY_DOC_TYPES } from "@/utils/constants";

const siteLogo = {
  name: SANITY_DOC_TYPES.siteLogo,
  type: "document",
  title: "Logo",
  fields: [
    {
      name: "name",
      type: "string",
      title: "Nume Fisier",
      validation: (rule: Rule) => rule.required().min(4).max(50),
    },
    {
      name: "imgUrl",
      type: "image",
      title: "Imagine",
      validation: (rule: Rule) => rule.required(),
    },
    {
      name: "width",
      type: "number",
      title: "Latime imagine",
      validation: (rule: Rule) => rule.required().integer(),
    },
    {
      name: "height",
      type: "number",
      title: "Inaltime imagine",
      validation: (rule: Rule) => rule.required().integer(),
    },
  ],
};

export default siteLogo;
