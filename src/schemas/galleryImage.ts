const galleryImage = {
  name: "gallery-image",
  type: "document",
  title: "gallery-image",
  fields: [
    {
      name: "name",
      type: "string",
      title: "Name",
    },
    {
      name: "imgUrl",
      type: "image",
      title: "ImgUrl",
    },
    {
      name: "width",
      type: "number",
      title: "Width",
    },
    {
      name: "height",
      type: "number",
      title: "Height",
    },
  ],
};

export default galleryImage;
