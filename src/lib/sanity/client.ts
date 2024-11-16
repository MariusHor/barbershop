import { type SanityImageSource } from "@sanity/image-url/lib/types/types";
import imageUrlBuilder from "@sanity/image-url";
import { createClient } from "next-sanity";
import { env } from "../../env";

const projectId = env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const apiVersion = env.NEXT_PUBLIC_SANITY_API_VERSION;
const dataset = env.NEXT_PUBLIC_NODE_ENV;

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
});

const builder = imageUrlBuilder(client);

export const urlFor = (source: SanityImageSource) => builder.image(source);
