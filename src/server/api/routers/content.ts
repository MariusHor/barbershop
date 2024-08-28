import { type Url } from "next/dist/shared/lib/router/router";

import type { SiteLogo, ShopLocation, SiteSettings, Page } from "sanity.types";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import { SANITY_DOC_TYPES } from "@/utils/constants";
import { z } from "zod";
import { type GalleryImage } from "@/utils/types";

function throwSanityErrorMessage({ dataType }: { dataType: string }) {
  throw new TRPCError({
    code: "NOT_FOUND",
    message: `Could not find ${dataType} data. Make sure that Sanity has a valid record.`,
  });
}

export const sanityContentRouter = createTRPCRouter({
  getSiteSettings: publicProcedure.query(async ({ ctx }) => {
    const dataType = SANITY_DOC_TYPES.siteSettings;
    const query = `*[_type == "${dataType}"]`;
    const data =
      await ctx.sanityClient.fetch<(SiteSettings & { scheduleLink: Url })[]>(
        query,
      );

    if (!data[0]) throwSanityErrorMessage({ dataType });

    return data[0];
  }),
  getSiteLogo: publicProcedure.query(async ({ ctx }) => {
    const dataType = SANITY_DOC_TYPES.siteLogo;
    const query = `*[_type == "${dataType}"]`;
    const data = await ctx.sanityClient.fetch<SiteLogo[]>(query);

    if (!data[0]) throwSanityErrorMessage({ dataType });

    return data[0];
  }),
  getShopLocation: publicProcedure.query(async ({ ctx }) => {
    const dataType = SANITY_DOC_TYPES.shopLocation;
    const query = `*[_type == "${dataType}"]`;
    const data = await ctx.sanityClient.fetch<ShopLocation[]>(query);

    if (!data[0]) throwSanityErrorMessage({ dataType });

    return data[0];
  }),
  getPageData: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ ctx, input }) => {
      const dataType = SANITY_DOC_TYPES.page;
      const query = `*[_type == "${dataType}" && slug.current == $slug]`;

      const data = await ctx.sanityClient.fetch<Page[]>(query, {
        slug: input.slug,
      });

      if (!data[0]) throwSanityErrorMessage({ dataType });

      return data[0];
    }),
  getRoutes: publicProcedure.query(async ({ ctx }) => {
    const dataType = SANITY_DOC_TYPES.page;
    const query = `*[_type == "${dataType}"] | order(order asc)`;

    const data = await ctx.sanityClient.fetch<Page[]>(query);

    if (!data[0]) throwSanityErrorMessage({ dataType });

    return data.map((page) => ({ name: page.title, path: page.path }));
  }),
  getGalleryImages: publicProcedure
    .input(
      z.object({ start: z.number().default(0), end: z.number().default(10) }),
    )
    .query(async ({ ctx, input }) => {
      const dataType = SANITY_DOC_TYPES.galleryImage;
      const query = `*[_type == "${dataType}"][$start...$end]{
        "imageUrl": image.asset->url,
        "width": image.asset->metadata.dimensions.width,
        "height": image.asset->metadata.dimensions.height,
        "alt": image.alt,
      } | order(_createdAt asc)`;

      const data = await ctx.sanityClient.fetch<GalleryImage[]>(query, {
        ...input,
      });

      if (!data[0]) throwSanityErrorMessage({ dataType });

      return data;
    }),
});
