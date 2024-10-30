import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";

import { schemaTypes } from "./src/schemas";
import { customDeskStructure } from "./src/lib/sanity/deskStructure";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID! || "ae4dl49v";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET! || "production";

export default defineConfig({
  basePath: "/studio", // <-- important that `basePath` matches the route you're mounting your studio from

  projectId,
  dataset,
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
