import { type Rule } from "@sanity/types";
import { SANITY_DOC_TYPES } from "../utils/constants";

const galleryImage = {
  name: SANITY_DOC_TYPES.servicesImage,
  type: "document",
  title: "Imagini Servicii",
  fields: [
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
          validation: (rule: Rule) =>
            rule
              .required()
              .warning(
                "Textul alternativ poate fi de ajutor atunci cand imaginea nu poate fi incarcata.",
              ),
        },
        {
          name: "width",
          type: "number",
          title: "Lățime",
          readOnly: true,
          hidden: true,
        },
        {
          name: "height",
          type: "number",
          title: "Înălțime",
          readOnly: true,
          hidden: true,
        },
      ],
    },
    {
      name: "name",
      type: "string",
      title: "Nume serviciu",
      validation: (rule: Rule) => rule.required().min(5).max(40),
    },
  ],
  preview: {
    select: {
      title: "image.asset.originalFilename",
      width: "image.asset.metadata.dimensions.width",
      height: "image.asset.metadata.dimensions.height",
    },
  },
};

export default galleryImage;
