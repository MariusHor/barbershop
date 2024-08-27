import { type Rule } from "@sanity/types";
import { SANITY_DOC_TYPES } from "@/utils/constants";

const galleryImage = {
  name: SANITY_DOC_TYPES.galleryImage,
  type: "document",
  title: "Imagini Galerie",
  fields: [
    {
      name: "name",
      type: "string",
      title: "Nume fisier",
      validation: (rule: Rule) => rule.required().min(4).max(50),
    },
    {
      name: "image",
      type: "image",
      title: "Imagine",
      validation: (rule: Rule) => rule.required(),
      fields: [
        {
          name: "alt",
          type: "string",
          title: "Text alternativ",
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
    },
  ],
};

export default galleryImage;
