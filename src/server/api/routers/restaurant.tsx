/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { auth, clerkClient } from "@clerk/nextjs";
import { z } from "zod";
import type { User } from "@clerk/nextjs/server";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { TRPCError } from "@trpc/server";

import bcrypt from 'bcrypt';



export const restaurantRouter = createTRPCRouter({
  // getAll: publicProcedure.query(async ({ ctx }) => {
  //   console.log('get all users')
  //   return ''
  // }),
  // getOne: publicProcedure
  //   .input(z.object({ id: z.number() }))
  //   .query(({ input, ctx }) => {
  //     return ctx.db.user.findUnique({
  //       where: {
  //         id: input.id
  //       },
  //     });
  //   }),
  create: publicProcedure.input(
    z.object({
      name: z.string(),
      userId: z.number(),
    })
  ).mutation(async ({ ctx, input }) => {
    const foundUser = await ctx.db.user.findUnique({
      where: {
        id: input.userId
      }
    })
    console.log(foundUser)
    if (foundUser) {
      const restaurant = await ctx.db.restaurant.create({
        data: {
          name: input.name,
          ownerId: foundUser.id
        }
      })

      if (restaurant) {
        await ctx.db.user.update({
          where: {
            id: foundUser.id
          },
          data: {
            restaurant: {
              connect: { id: restaurant.id }
            }
          }
        })
      }
      console.log('%cMyProject%cline:59%crestaurant', 'color:#fff;background:#ee6f57;padding:3px;border-radius:2px', 'color:#fff;background:#1f3c88;padding:3px;border-radius:2px', 'color:#fff;background:rgb(39, 72, 98);padding:3px;border-radius:2px', restaurant)
      return restaurant
    }
  }),

});
