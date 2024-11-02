import { type SanityImageSource } from "@sanity/image-url/lib/types/types";
import imageUrlBuilder from "@sanity/image-url";
import { createClient } from "next-sanity";

const projectId = process.env.SANITY_STUDIO_PROJECT_ID;
const apiVersion = process.env.SANITY_STUDIO_API_VERSION;
const dataset = process.env.MODE;

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
});

const builder = imageUrlBuilder(client);

export const urlFor = (source: SanityImageSource) => builder.image(source);
