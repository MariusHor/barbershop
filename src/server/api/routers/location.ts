import { type Location } from "sanity.types";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";

export const locationsRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    const query = '*[_type == "location"]';
    const data = await ctx.sanityClient.fetch<Location[]>(query);

    if (!data) throw new TRPCError({ code: "NOT_FOUND" });

    return data;
  }),
});
