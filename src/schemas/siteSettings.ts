import { type Rule } from "@sanity/types";
import { SANITY_DOC_TYPES } from "../utils/constants";
import { PageSectionBase } from "./blocks";

const siteSettings = {
  name: SANITY_DOC_TYPES.siteSettings,
  type: "document",
  title: "Setari website",
  groups: [
    {
      name: "websiteMeta",
      title: "Website metadata",
    },
    {
      name: "defaultInfo",
      title: "Default information",
    },
    {
      name: "defaultContent",
      title: "Default content",
    },
  ],
  fields: [
    {
      name: "title",
      type: "string",
      title: "Title",
      group: "websiteMeta",
      validation: (rule: Rule) => rule.required().min(10).max(50),
    },
    {
      name: "description",
      type: "text",
      title: "Description",
      group: "websiteMeta",
      validation: (rule: Rule) => rule.required().min(20),
    },
    {
      type: "object",
      name: "footerCta",
      title: "Footer CTA",
      group: "defaultContent",
      fields: PageSectionBase,
    },
    {
      name: "appointmentsUrl",
      type: "url",
      title: "Appointments Url",
      group: "defaultInfo",
      description:
        "Acts as default but can be overriden by location specific value",
    },
    {
      name: "locationUrl",
      type: "url",
      title: "Location Url",
      group: "defaultInfo",
      description:
        "Acts as default but can be overriden by location specific value",
    },
    {
      name: "phone",
      type: "string",
      title: "Phone",
      group: "defaultInfo",
      description:
        "Acts as default but can be overriden by location specific value",
    },
    {
      name: "email",
      type: "string",
      title: "Email",
      group: "defaultInfo",
      description:
        "Acts as default but can be overriden by location specific value",
    },
    {
      name: "socialPlatforms",
      type: "array",
      title: "Social Platforms",
      group: "defaultInfo",
      description:
        "Acts as default but can be overriden by location specific value",
      of: [
        {
          name: "account",
          type: "object",
          title: "Social Platform",
          fields: [
            {
              title: "Nume",
              name: "name",
              type: "string",
              validation: (rule: Rule) => rule.required(),
              options: {
                list: [
                  { title: "Facebook", value: "facebook" },
                  { title: "Instagram", value: "instagram" },
                  { title: "Twitter", value: "twitter" },
                ],
              },
            },
            {
              name: "link",
              type: "string",
              title: "Link",
              validation: (rule: Rule) => rule.required(),
            },
          ],
        },
      ],
    },
    {
      name: "timetables",
      type: "array",
      title: "Timetables",
      group: "defaultInfo",
      description:
        "Acts as default but can be overriden by location specific value",
      of: [
        {
          name: "timetable",
          type: "string",
          validation: (rule: Rule) => rule.required().min(10).max(50),
        },
      ],
    },
  ],
};

export default siteSettings;
