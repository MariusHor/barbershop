const barber = {
  name: "barber",
  type: "document",
  title: "Frizeri",
  fields: [
    {
      name: "name",
      type: "string",
      title: "Nume",
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

export default barber;
