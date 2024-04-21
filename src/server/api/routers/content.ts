import { type Url } from "next/dist/shared/lib/router/router";

import type { Logo, Location, SiteSettings } from "sanity.types";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";

export const sanityContentRouter = createTRPCRouter({
  getSiteSettings: publicProcedure.query(async ({ ctx }) => {
    const query = '*[_type == "siteSettings"]';
    const data =
      await ctx.sanityClient.fetch<(SiteSettings & { scheduleLink: Url })[]>(
        query,
      );

    if (!data) throw new TRPCError({ code: "NOT_FOUND" });

    return data[0];
  }),
  getLocation: publicProcedure.query(async ({ ctx }) => {
    const query = '*[_type == "location"]';
    const data = await ctx.sanityClient.fetch<Location[]>(query);

    if (!data) throw new TRPCError({ code: "NOT_FOUND" });

    return data[0];
  }),
  getLogo: publicProcedure.query(async ({ ctx }) => {
    const query = '*[_type == "logo"]';
    const data = await ctx.sanityClient.fetch<Logo[]>(query);

    if (!data) throw new TRPCError({ code: "NOT_FOUND" });

    return data[0];
  }),
});
