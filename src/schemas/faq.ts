import { type Rule } from "@sanity/types";
import { SANITY_DOC_TYPES } from "../utils/constants";

const faq = {
  name: SANITY_DOC_TYPES.faq,
  type: "document",
  title: "FAQ",
  fields: [
    {
      name: "question",
      type: "string",
      title: "Question",
      validation: (rule: Rule) => rule.required(),
    },
    {
      name: "answer",
      type: "array",
      title: "Answer",
      of: [
        {
          type: "block",
          styles: [
            { title: "Normal", value: "normal" },
            { title: "H2", value: "h2" },
            { title: "H3", value: "h3" },
          ],
          lists: [
            { title: "Bullet", value: "bullet" },
            { title: "Numbered", value: "number" },
          ],
          marks: {
            decorators: [
              { title: "Strong", value: "strong" },
              { title: "Emphasis", value: "em" },
              { title: "Underline", value: "underline" },
            ],
            annotations: [
              {
                title: "Link",
                name: "link",
                type: "object",
                fields: [
                  {
                    title: "URL",
                    name: "href",
                    type: "url",
                  },
                ],
              },
            ],
          },
        },
      ],
      validation: (rule: Rule) => rule.required(),
    },
  ],
};

export default faq;
