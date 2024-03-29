import { createServerSideHelpers } from "@trpc/react-query/server";
import superjson from "superjson";

import { createInnerTRPCContext } from "@/server/api/trpc";
import { appRouter } from "@/server/api/root";

export const getSSGHelper = () =>
  createServerSideHelpers({
    router: appRouter,
    ctx: createInnerTRPCContext(),
    transformer: superjson,
  });
