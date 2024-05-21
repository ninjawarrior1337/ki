// src/pages/api/trpc/[trpc].ts
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "../../../server/router";
import { createContext } from "../../../server/router/context";

// export API handler

const handler = async (req: Request) => fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext
})

export {handler as GET, handler as POST}
