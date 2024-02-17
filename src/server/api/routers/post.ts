/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { auth, clerkClient } from "@clerk/nextjs";
import { z } from "zod";
import type { User } from "@clerk/nextjs/server";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import type { Post } from "@prisma/client"
import { TRPCError } from "@trpc/server";

const filterUserForClient = (user: User) => {
  return {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    profileImage: user.imageUrl
  }
}


export const addUserDataToPosts = async (post: Post[]) => {
  console.log('add data user to post')
  return ''
}

// Create a new ratelimiter, that allows 3 requests per 1 minute
// const ratelimit = new Ratelimit({
//   redis: Redis.fromEnv(),
//   limiter: Ratelimit.slidingWindow(3, "1 m"),
//   analytics: true,
// });
export const postRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    const posts = await ctx.db.post.findMany({
      take: 100,
    })


    const users = (
      await clerkClient.users.getUserList({
        userId: posts.map((post) => post.authorId),
        limit: 100,
      })
    ).map(filterUserForClient)
    console.log('users', users)
    return posts.map((post) => ({
      post,
      author: users.find((user) => user.id === post.authorId)
    }))
  }),
  create: publicProcedure.input(
    z.object({
      content: z.string().max(200)
    })
  ).mutation(async ({ ctx, input }) => {
    const authorId = ctx.userId

    if (authorId) {
      // const { success } = await ratelimit.limit(authorId)
      // if (!success) throw new TRPCError({ code: "TOO_MANY_REQUESTS" });
      const post = await ctx.db.post.create({
        data: {
          authorId,
          content: input.content,
        }
      })
      return post
    }
  }),
  // getLatest: publicProcedure.query(({ ctx }) => {
  //   return ctx.db.post.findFirst({
  //     orderBy: { createdAt: "desc" },
  //   });
  // }),
});
