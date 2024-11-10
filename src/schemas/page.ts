import { Image, PageSectionBase } from "./blocks";
import { type Rule } from "@sanity/types";

const page = {
  name: "page",
  type: "document",
  title: "Pages",
  groups: [
    {
      name: "pageInfo",
      title: "Page Information",
    },
    {
      name: "sections",
      title: "Sections",
    },
  ],
  fields: [
    {
      name: "isIndex",
      title: "Is Homepage",
      type: "boolean",
      initialValue: false,
    },
    {
      name: "title",
      title: "Page title",
      type: "string",
      validation: (rule: Rule) => rule.required(),
      group: "pageInfo",
    },
    {
      name: "order",
      title: "Order",
      type: "number",
      validation: (rule: Rule) => rule.required().integer().positive().min(1),
      group: "pageInfo",
    },
    {
      name: "slug",
      type: "slug",
      title: "Slug",
      validation: (rule: Rule) => rule.required(),
      description: "Always click on generate after updating the page title",
      options: {
        source: "title",
        maxLength: 96,
      },
      group: "pageInfo",
    },
    {
      name: "sections",
      title: "Sections",
      type: "array",
      group: "sections",
      validation: (rule: Rule) => rule.required().min(1),
      of: [
        {
          type: "object",
          name: "section",
          title: "Section",
          fields: [
            {
              name: "type",
              type: "string",
              title: "Section Type",
              validation: (rule: Rule) => rule.required(),
              options: {
                list: [
                  { title: "Hero", value: "hero" },
                  { title: "Spotlight", value: "spotlight" },
                  { title: "Location", value: "location" },
                  { title: "Services", value: "services" },
                  { title: "About", value: "about" },
                  { title: "Gallery", value: "gallery" },
                  { title: "FAQ", value: "faq" },
                  { title: "Form", value: "form" },
                ],
              },
            },
            {
              name: "content",
              type: "object",
              title: "Content",
              fields: [
                ...PageSectionBase,
                {
                  name: "sectionSpecific",
                  type: "object",
                  title: "Specific Content",
                  fields: [
                    {
                      name: "marqueeText",
                      type: "string",
                      title: "Marquee Text",
                    },
                    {
                      name: "linkButton",
                      type: "object",
                      title: "Link Button",
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
                          title: "Target URL",
                        },
                      ],
                    },
                  ],
                },
                Image,
              ],
            },
          ],
          preview: {
            select: {
              title: "content.title",
              type: "type",
            },
            prepare({ title, type }: { title: string; type: string }) {
              return {
                title: title || "Untitled Section",
                subtitle: `${type.charAt(0).toUpperCase() + type.slice(1)} Section`,
              };
            },
          },
        },
      ],
    },
  ],
};

export default page;
