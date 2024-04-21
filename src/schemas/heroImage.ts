import { type Rule } from "@sanity/types";
import { SANITY_DOC_TYPES } from "@/utils/constants";

const heroImage = {
  name: SANITY_DOC_TYPES.heroImage,
  type: "document",
  title: "Imagine Principala",
  fields: [
    {
      name: "name",
      type: "string",
      title: "Nume fisier",
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

export default heroImage;
