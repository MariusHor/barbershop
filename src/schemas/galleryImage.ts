import { type Rule } from "@sanity/types";
import { SANITY_DOC_TYPES } from "../utils/constants";

const galleryImage = {
  name: SANITY_DOC_TYPES.galleryImage,
  type: "document",
  title: "Imagini Galerie",
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
