// src/server/trpc/router/_app.ts
import { router } from "../trpc";
import { exampleRouter } from "./example";
import { authRouter } from "./auth";
import { trackerRouter } from "./routines";

export const appRouter = router({
  example: exampleRouter,
  auth: authRouter,
  tracker: trackerRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
