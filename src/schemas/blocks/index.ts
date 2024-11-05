import { type Rule } from "@sanity/types";

export const Text = {
  name: "text",
  type: "array",
  title: "Text",
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
};

export const PageSectionBase = [
  {
    name: "title",
    title: "Title",
    type: "string",
  },
  {
    name: "subtitle",
    title: "Subtitle",
    type: "string",
  },
  Text,
];

export const Image = {
  name: "image",
  type: "image",
  title: "Image",
  fields: [
    {
      name: "alt",
      type: "string",
      title: "Alternative text",
      validation: (rule: Rule) =>
        rule
          .required()
          .warning(
            "Alternative text can be helpful when the image cannot be loaded.",
          ),
    },
    {
      name: "width",
      type: "number",
      title: "Width",
      readOnly: true,
      hidden: true,
    },
    {
      name: "height",
      type: "number",
      title: "Height",
      readOnly: true,
      hidden: true,
    },
  ],
};
