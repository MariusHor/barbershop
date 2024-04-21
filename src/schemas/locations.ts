import { type Rule } from "@sanity/types";

const locatii = {
  name: "location",
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
      name: "phone",
      type: "string",
      title: "Telefon",
      validation: (rule: Rule) => rule.required().min(8).max(30),
    },
    {
      name: "email",
      type: "string",
      title: "Email",
      validation: (rule: Rule) => rule.required().email(),
    },
    {
      name: "socialPlatforms",
      type: "array",
      title: "Platforme Social",
      of: [
        {
          name: "account",
          type: "object",
          title: "Cont Social",
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
            },
          ],
        },
      ],
    },
    {
      name: "timetables",
      type: "array",
      title: "Orar",
      of: [
        {
          name: "timetable",
          type: "string",
          title: "Orar",
          validation: (rule: Rule) => rule.required().min(10).max(50),
        },
      ],
    },
  ],
};

export default locatii;
