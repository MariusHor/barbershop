import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./src/schemas";
import { customDeskStructure } from "./src/lib/sanity/deskStructure";
import { getSanityConfig } from "./src/env.sanity";

const { projectId, dataset } = getSanityConfig();

export default defineConfig({
  projectId,
  dataset,
  basePath: "/studio",
  plugins: [
    structureTool({
      structure: customDeskStructure,
    }),
    visionTool(),
  ],
  schema: {
    types: schemaTypes,
  },
});
