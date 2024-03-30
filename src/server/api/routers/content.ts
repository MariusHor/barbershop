import type { Logo, Location } from "sanity.types";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";

export const sanityContentRouter = createTRPCRouter({
  getAllLocations: publicProcedure.query(async ({ ctx }) => {
    const query = '*[_type == "location"]';
    const data = await ctx.sanityClient.fetch<Location[]>(query);

    if (!data) throw new TRPCError({ code: "NOT_FOUND" });

    return data;
  }),
  getLogo: publicProcedure.query(async ({ ctx }) => {
    const query = '*[_type == "logo"]';
    const data = await ctx.sanityClient.fetch<Logo[]>(query);

    if (!data) throw new TRPCError({ code: "NOT_FOUND" });

    return data[0];
  }),
});
