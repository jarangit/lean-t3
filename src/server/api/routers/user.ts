/* eslint-disable @typescript-eslint/no-unsafe-argument */
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

const userCreatePayload = z.object({
  email: z.string(),
  password: z.string(),
})

export const userRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    console.log('get all users')
    return ''
  }),
  getOne: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(({ input, ctx }) => {
      return ctx.db.user.findUnique({
        where: {
          id: input.id
        },
        include: {
          restaurant: true,
        }
      });
    }),
  create: publicProcedure.input(
    z.object({
      email: z.string(),
      password: z.string(),
    })
  ).mutation(async ({ ctx, input }) => {
    const hashedPassword = await bcrypt.hash(input.password, 10);
    const data = {
      email: input.email,
      password: hashedPassword.toString()
    }
    console.log(data);
    return ctx.db.user.create({
      data: data
    })
  }),

  login: publicProcedure.input(
    z.object({
      email: z.string(),
      password: z.string(),
    })
  ).query(async ({ ctx, input }) => {
    const user = await ctx.db.user.findUnique({
      where: {
        email: input.email,
      }
    })
    if (!user) {
      throw new Error('User not found');
    }
    const checkedPassword = await bcrypt.compare(input.password, user.password);
    if (!checkedPassword) {
      throw new Error('Invalid password');
    }
    return {
      email: user.email,
      id: user.id,
      name: user.name,
    };
  })
});
