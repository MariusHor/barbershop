const heroImage = {
  name: "hero-image",
  type: "document",
  title: "Imagine Principala",
  fields: [
    {
      name: "name",
      type: "string",
      title: "Nume fisier",
    },
    {
      name: "imgUrl",
      type: "image",
      title: "Imagine",
    },
    {
      name: "width",
      type: "number",
      title: "Latime imagine",
    },
    {
      name: "height",
      type: "number",
      title: "Inaltime imagine",
    },
  ],
};

export default heroImage;
