import { type Rule } from "@sanity/types";
import { type Page } from "sanity.types";

const page = {
  name: "page",
  type: "document",
  title: "Pagini",
  fields: [
    {
      name: "title",
      title: "Titlu pagina",
      type: "string",
      validation: (rule: Rule) => rule.required(),
    },
    {
      name: "order",
      title: "Ordine",
      type: "number",
      validation: (rule: Rule) =>
        rule
          .required()
          .integer()
          .positive()
          .min(1)
          .custom(async (order: string | number, context) => {
            const { document } = context;
            const client = context.getClient({ apiVersion: "2023-08-27" });

            const existingPages: Page[] = await client.fetch(
              `*[_type == "page" && _id != $id && order == $order]`,
              { id: document?._id, order },
            );

            if (
              existingPages.length > 0 &&
              existingPages[0]?._id !== document?._id.replace("drafts.", "")
            ) {
              return `Ordine ${order} este deja folosită. Vă rugăm să alegeți un alt număr.`;
            }

            return true;
          }),
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
              name: "style",
              title: "Stil",
              type: "string",
              validation: (rule: Rule) => rule.required().min(1),
              options: {
                list: [
                  { title: "Column", value: "column" },
                  { title: "Row", value: "row" },
                  { title: "Row reversed", value: "row-reversed" },
                ],
              },
              initialValue: "classic",
            },
            {
              name: "value",
              title: "Valoare",
              type: "string",
              validation: (rule: Rule) => rule.required().min(1),
              options: {
                list: [
                  { title: "Intro", value: "intro" },
                  { title: "Locatie", value: "location" },
                  { title: "Servicii", value: "services" },
                  { title: "Urmareste", value: "follow" },
                  { title: "Despre", value: "about" },
                ],
              },
              initialValue: "intro",
            },
            {
              name: "title",
              title: "Titlu",
              type: "string",
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
              name: "withGallery",
              title: "Galerie",
              type: "boolean",
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
                },
              ],
            },
            {
              name: "marqueeText",
              title: "Text animat",
              type: "string",
            },
            {
              name: "image",
              type: "image",
              title: "Imagine",
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
        },
      ],
    },
  ],
};

export default page;
