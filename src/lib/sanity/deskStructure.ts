import { type StructureBuilder } from "sanity/structure";

export const customDeskStructure = (S: StructureBuilder) =>
  S.list()
    .title("Base")
    .items([
      S.listItem()
        .title("Setari Generale")
        .child(
          S.document().schemaType("siteSettings").documentId("siteSettings"),
        ),
      ...S.documentTypeListItems().filter(
        (listItem) => !["siteSettings"].includes(listItem.getId()!),
      ),
    ]);
