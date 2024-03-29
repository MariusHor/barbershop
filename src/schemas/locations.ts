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
      name: "accounts",
      type: "array",
      title: "Conturi Social",
      of: [
        {
          name: "account",
          type: "object",
          title: "Cont Social",
          fields: [
            {
              name: "platform",
              type: "string",
              title: "Platforma",
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
  ],
};

export default locatii;
