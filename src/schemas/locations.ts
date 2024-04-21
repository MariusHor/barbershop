const locatii = {
  name: "location",
  type: "document",
  title: "Locatii",
  fields: [
    {
      name: "name",
      type: "string",
      title: "Nume",
    },
    {
      name: "street",
      type: "string",
      title: "Strada",
    },
    {
      name: "city",
      type: "string",
      title: "Oras",
    },
    {
      name: "zip",
      type: "string",
      title: "Cod Postal",
    },
    {
      name: "phone",
      type: "string",
      title: "Telefon",
    },
    {
      name: "email",
      type: "string",
      title: "Email",
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
        },
      ],
    },
  ],
};

export default locatii;
