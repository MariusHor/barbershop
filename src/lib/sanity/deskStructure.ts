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
      S.listItem()
        .title("Logo")
        .child(S.document().schemaType("siteLogo").documentId("siteLogo")),
      ...S.documentTypeListItems().filter(
        (listItem) => !["siteLogo", "siteSettings"].includes(listItem.getId()!),
      ),
    ]);
