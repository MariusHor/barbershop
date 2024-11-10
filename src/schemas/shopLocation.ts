import { type Rule } from "@sanity/types";
import { SANITY_DOC_TYPES } from "../utils/constants";

const shopLocation = {
  name: SANITY_DOC_TYPES.shopLocation,
  type: "document",
  title: "Locatii",
  fields: [
    {
      name: "name",
      type: "string",
      title: "Nume",
      validation: (rule: Rule) => rule.required().min(4).max(50),
    },
    {
      name: "street",
      type: "string",
      title: "Strada",
      validation: (rule: Rule) => rule.required().min(10).max(50),
    },
    {
      name: "city",
      type: "string",
      title: "Oras",
      validation: (rule: Rule) => rule.required().min(3).max(30),
    },
    {
      name: "zip",
      type: "number",
      title: "Cod Postal",
      validation: (rule: Rule) => rule.required().integer(),
    },
    {
      name: "appointmentsUrl",
      type: "url",
      title: "Appointments Url",
      description:
        "If no value set, default value from General Settings will be used",
    },
    {
      name: "locationUrl",
      type: "url",
      title: "Location Url",
      description:
        "If no value set, default value from General Settings will be used",
    },
    {
      name: "phone",
      type: "string",
      title: "Phone",
      description:
        "If no value set, default value from General Settings will be used",
    },
    {
      name: "email",
      type: "string",
      title: "Email",
      description:
        "If no value set, default value from General Settings will be used",
    },
    {
      name: "socialPlatforms",
      type: "array",
      title: "Social Platforms",
      description:
        "If no value set, default value from General Settings will be used",
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
      description:
        "If no value set, default value from General Settings will be used",
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

export default shopLocation;
