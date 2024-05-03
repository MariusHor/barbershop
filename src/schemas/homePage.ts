const homePage = {
  name: "page",
  type: "document",
  title: "Page",
  fields: [
    { name: "title", type: "string" },
    {
      name: "pageBuilder",
      type: "array",
      title: "Page builder",
      of: [
        {
          name: "hero",
          type: "object",
          title: "Hero",
          fields: [
            {
              name: "heading",
              type: "string",
            },
            {
              name: "tagline",
              type: "string",
            },
            {
              name: "image",
              type: "image",
              options: { hotspot: true },
              fields: [
                {
                  name: "alt",
                  type: "string",
                  title: "Alternative text",
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};

export default homePage;
