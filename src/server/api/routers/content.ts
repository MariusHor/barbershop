import { type Url } from "next/dist/shared/lib/router/router";

import type {
  SiteLogo,
  ShopLocation,
  SiteSettings,
  Page,
  GalleryImage,
  Services,
} from "sanity.types";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import { SANITY_DOC_TYPES } from "@/utils/constants";
import { z } from "zod";

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
    const query = `*[_type == "${dataType}"]{
        ...,
        image{
          ...,
          "width": asset->metadata.dimensions.width,
          "height": asset->metadata.dimensions.height
        }
      }`;
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
  getServicesData: publicProcedure.query(async ({ ctx }) => {
    const dataType = SANITY_DOC_TYPES.services;
    const query = `*[_type == "${dataType}"]`;
    const data = await ctx.sanityClient.fetch<Services[]>(query);

    if (!data.length) throwSanityErrorMessage({ dataType });

    return data;
  }),
  getPageData: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ ctx, input }) => {
      const dataType = SANITY_DOC_TYPES.page;
      const query = `*[_type == "${dataType}" && slug.current == $slug]{
        ...,
        sections[]{
          ...,
          content{
            ...,
            image{
              ...,
              "width": asset->metadata.dimensions.width,
              "height": asset->metadata.dimensions.height
            }
          }
        }
      }`;

      const data = await ctx.sanityClient.fetch<Page[]>(query, {
        slug: input.slug,
      });

      if (!data[0]) throwSanityErrorMessage({ dataType });

      return data[0];
    }),
  getRoutes: publicProcedure.query(async ({ ctx }) => {
    const dataType = SANITY_DOC_TYPES.page;
    const query = `*[_type == "${dataType}"] | order(order asc) { title }`;

    const data = await ctx.sanityClient.fetch<Page[]>(query);

    if (!data[0]) throwSanityErrorMessage({ dataType });

    return data.map((page) => ({
      name: page.title,
      path: `/${page.title.toLowerCase()}`,
    }));
  }),
  getGalleryImages: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).nullish(),
        cursor: z
          .object({
            _createdAt: z.string().nullish(),
            _id: z.string().nullish(),
          })
          .nullish(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const limit = input.limit ?? 50;
      const { cursor } = input;
      const dataType = SANITY_DOC_TYPES.galleryImage;

      const filterCondition =
        cursor?._createdAt && cursor?._id
          ? `&& (
          _createdAt > $lastCreatedAt || 
          (_createdAt == $lastCreatedAt && _id > $lastId)
        )`
          : "";

      const query = `*[
      _type == "${dataType}"
      ${filterCondition}
    ] | order(_createdAt asc)[0...${limit}]{
      _id,
      _createdAt,
      image{
        ...,
        "width": asset->metadata.dimensions.width,
        "height": asset->metadata.dimensions.height
      }
    }`;

      const countQuery = `count(*[_type == "${dataType}"])`;
      const totalCount = await ctx.sanityClient.fetch<number>(countQuery);

      const params =
        cursor?._createdAt && cursor?._id
          ? {
              lastCreatedAt: cursor._createdAt,
              lastId: cursor._id,
            }
          : {};

      const data = await ctx.sanityClient.fetch<GalleryImage[]>(query, params);

      let nextCursor: typeof cursor | undefined = undefined;

      const nextItem = data.at(-1);
      nextCursor = {
        _createdAt: nextItem?._createdAt,
        _id: nextItem?._id,
      };

      return {
        items: data,
        nextCursor,
        totalCount,
      };
    }),
});
