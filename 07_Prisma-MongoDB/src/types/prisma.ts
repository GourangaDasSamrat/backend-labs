import { Prisma, Post as PrismaPost, User as PrismaUser } from "@db";

// Basic Types
export type User = PrismaUser;
export type Post = PrismaPost;

// Composite Types
export type UserWithPosts = Prisma.UserGetPayload<{
  include: { posts: true };
}>;

// Input Types
export type CreateUserInput = Prisma.UserCreateInput;
export type CreatePostInput = Prisma.PostCreateInput;
