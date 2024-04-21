const websiteConfig = {
  name: "siteSettings",
  type: "document",
  title: "Setari website",
  fields: [
    {
      name: "title",
      type: "string",
      title: "Titlu website",
    },
    {
      name: "description",
      type: "text",
      title: "Descriere website",
    },
    {
      name: "scheduleLink",
      type: "url",
      title: "Link programari",
    },
  ],
};

export default websiteConfig;
