import { router, protectedProcedure } from "../trpc";
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

  deleteModelTask: protectedProcedure.input(z.object({ id: z.string() })).mutation(({ input, ctx }) => {
    return ctx.prisma.routineModel.update({
      where: {
        userId: ctx.session.user.id
      },
      data: {
        exercises: {
          delete: {
            id: input.id
          }
        }
      }
    })
  }),

  getRoutines: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.user.findUnique({
      where: {
        id: ctx.session.user.id
      },
      select: {
        routines: {
          orderBy: {
            createdAt: "desc"
          }
        }
      }
    })
  }),

  createRoutine: protectedProcedure.mutation(async ({ ctx }) => {
    let routineModel = await ctx.prisma.routineModel.findUnique({
      where: {
        userId: ctx.session.user.id
      },
      select: {
        exercises: true
      }
    })

    if (!routineModel || !routineModel.exercises) {
      routineModel = await ctx.prisma.routineModel.create({
        data: {
          userId: ctx.session.user.id,
        },
        select: {
          exercises: true
        }
      })
    }

    return ctx.prisma.routine.create({
      data: {
        userId: ctx.session.user.id,
        exercises: {
          create: routineModel.exercises.map((exercise) => {
            return {
              task: exercise.task
            }
          })
        }
      }
    })
  }),

  updateLastRoutine: protectedProcedure.mutation(async ({ ctx }) => {
    const routineModel = await ctx.prisma.routineModel.findUnique({
      where: {
        userId: ctx.session.user.id
      },
      select: {
        exercises: true

      },

    })

    const lastRoutine = await ctx.prisma.routine.findMany({
      where: {
        userId: ctx.session.user.id
      },
      select: {
        exercises: true,
        id: true
      },
      orderBy: {
        createdAt: "desc"
      },
      take: 1
    })


    if (lastRoutine && lastRoutine[0]) {
      const lastTask = routineModel?.exercises.filter(exercise => {
        return !lastRoutine[0]?.exercises.some(exer => {
          return exer.task === exercise.task
        })
      })

      if (lastTask && lastTask.length > 0) {
        return ctx.prisma.routine.update({
          where: {
            id: lastRoutine[0].id
          },
          data: {
            exercises: {
              create: lastTask.map(task => {
                return {
                  task: task.task
                }
              })
            }
          }
        })
      }
    }
    return
  }),

  toggleTask: protectedProcedure.input(z.object({ id: z.string(), concluded: z.boolean() })).mutation(({ input, ctx }) => {
    console.log(input)
    return ctx.prisma.exercise.update({
      where: {
        id: input.id
      },
      data: {
        concluded: input.concluded
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
            createdAt: true,
            id: true,
            exercises: true
          }
        },
        routines: {
          select: {
            createdAt: true,
            id: true,
            exercises: true
          },
          orderBy: {
            createdAt: "desc"
          }
        },
        sessions: true
      }
    })
  })

})

