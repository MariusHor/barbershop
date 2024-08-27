import { type Rule } from "@sanity/types";

const page = {
  name: "page",
  type: "document",
  title: "Page",
  fields: [
    {
      name: "title",
      title: "Titlu pagina",
      type: "string",
      validation: (rule: Rule) => rule.required(),
    },
    {
      name: "path",
      title: "Adresa relativa",
      type: "string",
      validation: (rule: Rule) => rule.required(),
    },
    {
      name: "slug",
      type: "slug",
      title: "Slug",
      validation: (rule: Rule) => rule.required(),
      options: {
        source: "title",
        maxLength: 96,
      },
    },
    {
      name: "sections",
      type: "array",
      title: "Sectiuni pagina",
      of: [
        {
          name: "section",
          type: "object",
          title: "Sectiune",
          fields: [
            {
              name: "title",
              title: "Titlu",
              type: "string",
              validation: (rule: Rule) => rule.required().min(4).max(50),
            },
            {
              name: "subtitle",
              title: "Subtitlu",
              type: "string",
            },
            {
              name: "content",
              title: "Continut",
              type: "string",
            },
            {
              name: "ctaButton",
              title: "Buton CTA",
              type: "object",
              fields: [
                {
                  name: "text",
                  type: "string",
                  title: "Text",
                  validation: (rule: Rule) => rule.required(),
                },
              ],
            },
            {
              name: "linkButton",
              title: "Buton link",
              type: "object",
              fields: [
                {
                  name: "text",
                  type: "string",
                  title: "Text",
                  validation: (rule: Rule) => rule.required(),
                },
                {
                  name: "href",
                  type: "string",
                  title: "Catre",
                  validation: (rule: Rule) => rule.required(),
                },
              ],
            },
            {
              name: "image",
              type: "image",
              title: "Imagine",
              options: { hotspot: true },
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
        },
      ],
    },
  ],
};

export default page;

// {
//   name: "ctaButton",
//   title: "Buton CTA",
//   type: "array",
//   of: [
//     {
//       name: "text",
//       type: "string",
//       title: "Text",
//     },
//   ],
// },
// {
//   name: "linkButton",
//   title: "Buton link",
//   type: "array",
//   of: [
//     {
//       name: "text",
//       type: "string",
//       title: "Text",
//     },
//     {
//       name: "href",
//       type: "string",
//       title: "Catre",
//     },
//   ],
// },
