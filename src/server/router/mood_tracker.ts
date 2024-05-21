import { z } from "zod";
import * as trpc from "@trpc/server";
import { protectedProcedure } from "./protected-router";
import { router } from "./trpc";

export const createMoodTrackerEntrySchema = z.object({
  date: z.date(),
  content: z.string(),
  feeling: z.enum(["NEGATIVE", "POSITIVE", "NEUTRAL"]),
});

const mtProcedure = protectedProcedure.use(async ({ ctx, next }) => {
  const userId = ctx.session.user.id;
  await ctx.prisma.moodTracker.upsert({
    where: {
      ownerId: userId,
    },
    create: {
      ownerId: userId,
    },
    update: {},
  });

  return next();
});

export const mtRouter = router({
  getMoodTrackerEntries: mtProcedure
    .input(
      z.object({
        year: z.number().int(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      return await ctx.prisma.moodTracker
        .findFirst({
          where: {
            ownerId: userId,
          },
        })
        .entries({
          where: {
            date: {
              gte: new Date(`${input.year}-01-01`),
              lt: new Date(`${input.year + 1}-01-01`),
            },
          },
        });
    }),
  getMoodTrackerEntry: mtProcedure
    .input(
      z.object({
        date: z.date(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      const mt = await ctx.prisma.moodTracker.findFirstOrThrow({
        where: {
          ownerId: userId,
        },
        select: {
          id: true,
        },
      });
      return await ctx.prisma.moodTrackerEntry.findFirst({
        where: {
          moodTrackerId: mt.id,
          date: {
            equals: input.date,
          },
        },
      });
    }),
  createMoodTrackerEntry: mtProcedure
    .input(createMoodTrackerEntrySchema)
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      const mt = await ctx.prisma.moodTracker.findFirstOrThrow({
        where: {
          ownerId: userId,
        },
        select: {
          id: true,
        },
      });
      await ctx.prisma.moodTrackerEntry.upsert({
        where: {
          moodTrackerId_date: {
            moodTrackerId: mt.id,
            date: input.date,
          },
        },
        create: {
          moodTrackerId: mt.id,
          date: input.date,
          content: input.content,
          feeling: input.feeling,
        },
        update: {
          date: input.date,
          content: input.content,
          feeling: input.feeling,
        },
      });
    }),
  deleteMoodTrackerEntry: mtProcedure
    .input(
      z.object({
        id: z.number().int(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      const e = await ctx.prisma.moodTracker
        .findFirstOrThrow({
          where: {
            ownerId: userId,
          },
        })
        .entries();

      if (e.length === 0) {
        throw new trpc.TRPCError({ code: "NOT_FOUND" });
      }

      await ctx.prisma.moodTrackerEntry.delete({
        where: {
          id: input.id,
        },
      });
    }),
});
