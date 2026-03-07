import { Post } from "@/types/prisma";
import { ApiError } from "@/utils/apiError";
import prisma from "@db";
import { Request, Response } from "express";

// create new post
export const handleCreatePost = async (req: Request, res: Response) => {
  try {
    // extract data from request body
    let { slug, title, content, authorId } = req.body;
    slug = slug?.trim();
    title = title?.trim();
    content = content?.trim();

    if (!slug || !title || !content || !authorId) {
      throw new ApiError(400, "All fields required");
    }

    // create post
    const createPost: Post = await prisma.post.create({
      data: {
        slug,
        title,
        content,
        author: { connect: { id: authorId } },
      },
    });

    res.status(200).json(createPost);
  } catch (err) {
    if (err instanceof Error) {
      throw new ApiError(500, err.message, [err]);
    }
    throw new ApiError(500, "Something went wrong", [err]);
  }
};
