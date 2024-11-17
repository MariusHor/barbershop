import { z } from "zod";

const sanityEnvSchema = z.object({
  projectId: z.string(),
  dataset: z.string(),
  studioHost: z.string(),
  apiVersion: z.string(),
});

const validateConfig = (
  config: Record<string, unknown>,
  context: "Sanity Studio" | "Next.js",
) => {
  try {
    return sanityEnvSchema.parse(config);
  } catch (error) {
    throw new Error(
      `Missing ${context} environment variables. Make sure ${
        context === "Sanity Studio"
          ? "SANITY_STUDIO_PROJECT_ID, SANITY_STUDIO_DATASET, SANITY_STUDIO_HOST and SANITY_STUDIO_API_VERSION"
          : "NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET, NEXT_PUBLIC_SANITY_STUDIO_HOST and NEXT_PUBLIC_SANITY_API_VERSION"
      } are set in your .env file. ${error instanceof Error ? error.message : ""}`,
    );
  }
};

const isSanityStudioContext = () => {
  if (typeof window !== "undefined") {
    if (
      window.location.hostname === "localhost" &&
      window.location.port === "3333"
    ) {
      return true;
    }

    const isStudioHost =
      process.env.SANITY_STUDIO_HOST &&
      window.location.host.startsWith(process.env.SANITY_STUDIO_HOST);

    return isStudioHost;
  }

  return process.env.SANITY_STUDIO_PROJECT_ID !== undefined;
};

export const getSanityConfig = () => {
  const _isSanityStudioContext = isSanityStudioContext();

  if (_isSanityStudioContext) {
    return validateConfig(
      {
        projectId: process.env.SANITY_STUDIO_PROJECT_ID,
        dataset: process.env.SANITY_STUDIO_DATASET,
        studioHost: process.env.SANITY_STUDIO_HOST,
        apiVersion: process.env.SANITY_STUDIO_API_VERSION,
      },
      "Sanity Studio",
    );
  }

  return validateConfig(
    {
      projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
      dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
      studioHost: process.env.NEXT_PUBLIC_SANITY_STUDIO_HOST,
      apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION,
    },
    "Next.js",
  );
};
