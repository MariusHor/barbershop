import { type Rule } from "@sanity/types";

const galleryImage = {
  name: "gallery-image",
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

export default galleryImage;
