import { type Url } from "next/dist/shared/lib/router/router";

import type {
  SiteLogo,
  ShopLocation,
  SiteSettings,
  HeroImage,
} from "sanity.types";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import { SANITY_DOC_TYPES } from "@/utils/constants";

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
  getHeroImage: publicProcedure.query(async ({ ctx }) => {
    const dataType = SANITY_DOC_TYPES.heroImage;
    const query = `*[_type == "${dataType}"]`;
    const data = await ctx.sanityClient.fetch<HeroImage[]>(query);

    if (!data[0]) throwSanityErrorMessage({ dataType });

    return data[0];
  }),
});
