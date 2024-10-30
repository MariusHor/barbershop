import { type Rule } from "@sanity/types";
import { SANITY_DOC_TYPES } from "../utils/constants";

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
};

export default barber;
