import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";

import { schemaTypes } from "./src/schemas";
import { customDeskStructure } from "./src/lib/sanity/deskStructure";

const projectId =
  process.env.SANITY_STUDIO_PROJECT_ID! ||
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!;
const dataset = process.env.NODE_ENV;

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
