import { type Rule } from "@sanity/types";
import { SANITY_DOC_TYPES } from "@/utils/constants";

const barber = {
  name: SANITY_DOC_TYPES.barber,
  type: "document",
  title: "Frizeri",
  fields: [
    {
      name: "name",
      type: "string",
      title: "Nume",
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

export default barber;
