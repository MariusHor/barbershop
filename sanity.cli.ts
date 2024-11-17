import { defineCliConfig } from "sanity/cli";
import { getSanityConfig } from "./src/env.sanity";

const { projectId, dataset, studioHost } = getSanityConfig();

export default defineCliConfig({
  api: { projectId, dataset },
  studioHost,
});
