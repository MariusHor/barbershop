import { type Rule } from "@sanity/types";
import { SANITY_DOC_TYPES } from "../utils/constants";

const services = {
  name: SANITY_DOC_TYPES.services,
  type: "document",
  title: "Servicii",
  fields: [
    {
      name: "name",
      type: "string",
      title: "Name",
      validation: (rule: Rule) => rule.required(),
    },
    {
      name: "price",
      type: "number",
      title: "Price",
      validation: (rule: Rule) => rule.required().min(0),
    },
    {
      name: "image",
      type: "image",
      title: "Image",
      options: {
        hotspot: true,
      },
      validation: (rule: Rule) => rule.required(),
    },
    {
      name: "description",
      type: "array",
      title: "Description",
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
    {
      name: "details",
      type: "array",
      title: "Details",
      of: [{ type: "string" }],
      validation: (rule: Rule) => rule.required(),
    },
    {
      name: "duration",
      type: "number",
      title: "Duration - in minutes",
      validation: (rule: Rule) => rule.required().min(0),
    },
    {
      name: "order",
      type: "number",
      title: "Order",
    },
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "price",
      media: "image",
    },
  },
};

export default services;
