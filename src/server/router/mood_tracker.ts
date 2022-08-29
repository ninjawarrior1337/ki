import { z } from "zod";
import * as trpc from "@trpc/server"
import { createProtectedRouter } from "./protected-router";

export const mtRouter = createProtectedRouter()
  .middleware(async ({ctx, next}) => {
    const userId = ctx.session.user.id
    await ctx.prisma.moodTracker.upsert({
      where: {
        ownerId: userId
      },
      create: {
        ownerId: userId,
      },
      update: {}
    })

    return next()
  })
  .query("getMoodTrackerEntries", {
    input: z
      .object({
        year: z.number().int()
      }),
    async resolve({ctx, input}) {
      const userId = ctx.session.user.id
      return await ctx.prisma.moodTracker.findFirst({
        where: {
          ownerId: userId
        },
      }).entries({
          where: {
            date: {
              gte: new Date(`${input.year}-01-01`),
              lt: new Date(`${input.year+1}-01-01`)
            }
          }
      });
    }
  })
  .query("getMoodTrackerEntry", {
    input: z
      .object({
        date: z.date()
      }),
    async resolve({ctx, input}) {
      const userId = ctx.session.user.id
      const mt = await ctx.prisma.moodTracker.findFirstOrThrow({
        where: {
          ownerId: userId
        },
        select: {
          id: true
        }
      });
      return await ctx.prisma.moodTrackerEntry.findFirst({
        where: {
          moodTrackerId: mt.id,
          date: {
            equals: input.date
          }
        },
      });
    }
  })
  .mutation("createMoodTrackerEntry", {
    input: z
      .object({
        date: z.date(),
        content: z.string(),
        feeling: z.enum(["NEGATIVE", "POSITIVE", "NEUTRAL"])
      }),
    async resolve({ctx, input}) {
      const userId = ctx.session.user.id
      const mt = await ctx.prisma.moodTracker.findFirstOrThrow({
        where: {
          ownerId: userId
        },
        select: {
          id: true
        }
      });
      await ctx.prisma.moodTrackerEntry.upsert({
        where: {
          moodTrackerId_date: {
            moodTrackerId: mt.id,
            date: input.date
          }
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
        }
      })
    }
  })
  .mutation("deleteMoodTrackerEntry", {
    input: z
      .object({
        id: z.number().int()
      }),
    async resolve({ctx, input}) {
      const userId = ctx.session.user.id
      const e = await ctx.prisma.moodTracker.findFirstOrThrow({
        where: {
          ownerId: userId,
        }
      }).entries();

      if(e.length === 0) {
        throw new trpc.TRPCError({code: "NOT_FOUND"})
      }

      await ctx.prisma.moodTrackerEntry.delete({
        where: {
          id: input.id,
        }
      })
    }
  })