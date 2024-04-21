import { type Url } from "next/dist/shared/lib/router/router";

import type { SiteLogo, ShopLocation, SiteSettings } from "sanity.types";
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
    const query = `*[_type == "${SANITY_DOC_TYPES.siteSettings}"]`;

    const data =
      await ctx.sanityClient.fetch<(SiteSettings & { scheduleLink: Url })[]>(
        query,
      );

    if (!data[0]) throwSanityErrorMessage({ dataType: "siteSettings" });

    return data[0];
  }),
  getSiteLogo: publicProcedure.query(async ({ ctx }) => {
    const query = `*[_type == "${SANITY_DOC_TYPES.siteLogo}"]`;
    const data = await ctx.sanityClient.fetch<SiteLogo[]>(query);

    if (!data[0]) throwSanityErrorMessage({ dataType: "siteLogo" });

    return data[0];
  }),
  getShopLocation: publicProcedure.query(async ({ ctx }) => {
    const query = `*[_type == "${SANITY_DOC_TYPES.shopLocation}"]`;
    const data = await ctx.sanityClient.fetch<ShopLocation[]>(query);

    if (!data[0]) throwSanityErrorMessage({ dataType: "shopLocation" });

    return data[0];
  }),
});
