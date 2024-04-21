import { type Url } from "next/dist/shared/lib/router/router";

import type { Logo, Location, SiteSettings } from "sanity.types";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";

function throwSanityErrorMessage({ dataType }: { dataType: string }) {
  throw new TRPCError({
    code: "NOT_FOUND",
    message: `Could not find ${dataType} data. Make sure that Sanity has a valid record.`,
  });
}

export const sanityContentRouter = createTRPCRouter({
  getSiteSettings: publicProcedure.query(async ({ ctx }) => {
    const query = '*[_type == "siteSettings"]';
    const data =
      await ctx.sanityClient.fetch<(SiteSettings & { scheduleLink: Url })[]>(
        query,
      );

    if (!data[0]) throwSanityErrorMessage({ dataType: "Site Settings" });

    return data[0];
  }),
  getLocation: publicProcedure.query(async ({ ctx }) => {
    const query = '*[_type == "location"]';
    const data = await ctx.sanityClient.fetch<Location[]>(query);

    if (!data[0]) throwSanityErrorMessage({ dataType: "Location" });

    return data[0];
  }),
  getLogo: publicProcedure.query(async ({ ctx }) => {
    const query = '*[_type == "logo"]';
    const data = await ctx.sanityClient.fetch<Logo[]>(query);

    if (!data[0]) throwSanityErrorMessage({ dataType: "Logo" });

    return data[0];
  }),
});
