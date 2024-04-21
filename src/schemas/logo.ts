import { type Rule } from "@sanity/types";

const barber = {
  name: "logo",
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

export default barber;
