import { router } from "./trpc";
import { mtRouter } from "./mood_tracker";

export const appRouter = router({
  mt: mtRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
