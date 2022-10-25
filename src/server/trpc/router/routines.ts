import { router, publicProcedure, protectedProcedure } from "../trpc";
import { z } from "zod";

export const trackerRouter = router({
  newTask: protectedProcedure
    .input(z.object({ task: z.string() }))
    .mutation(({ input, ctx }) => {
      return ctx.prisma.routineModel.upsert({
        where: {
          userId: ctx.session.user.id
        },
        update: {
          exercises: {
            create: {
              task: input.task,
            }
          }
        },
        create: {
          userId: ctx.session.user.id,
          exercises: {
            create: {
              task: input.task,
            }
          }
        }
      })
    }),

  getModelTasks: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.routineModel.findUnique({
      where: {
        userId: ctx.session.user.id
      },
      select: {
        exercises: true
      }
    });
  }),

  getRoutines: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.user.findUnique({
      where: {
        id: ctx.session.user.id
      },
      select: {
        routines: true
      }
    })
  }),

  getUser: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.user.findUnique({
      where: {
        id: ctx.session.user.id
      },
      select: {
        routineModel: {
          select: {
            exercises: true
          }
        },
        routines: true,
        sessions: true
      }
    })
  })

})

