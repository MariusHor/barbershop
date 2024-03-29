const galleryImage = {
  name: "gallery-image",
  type: "document",
  title: "Imagini Galerie",
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

export default galleryImage;
