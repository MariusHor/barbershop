import { type SanityImageSource } from "@sanity/image-url/lib/types/types";
import imageUrlBuilder from "@sanity/image-url";
import { createClient } from "next-sanity";
import { getSanityConfig } from "../../env.sanity";

const { projectId, dataset, apiVersion } = getSanityConfig();

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
});

const builder = imageUrlBuilder(client);

export const urlFor = (source: SanityImageSource) => builder.image(source);
