// src/server/router/index.ts
import { createRouter } from "./context";
import superjson from "superjson";

import { mtRouter } from "./mood_tracker";

export const appRouter = createRouter()
  .transformer(superjson)
  .merge("mt.", mtRouter)

// export type definition of API
export type AppRouter = typeof appRouter;
