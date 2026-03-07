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

    res.status(200).json({ success: true, createPost });
  } catch (err) {
    if (err instanceof Error) {
      throw new ApiError(500, err.message, [err]);
    }
    throw new ApiError(500, "Something went wrong", [err]);
  }
};

// update post
export const handleUpdatePost = async (req: Request, res: Response) => {
  try {
    // extract post id
    const { id } = req.params;

    // validate id
    if (!id || Array.isArray(id)) {
      throw new ApiError(400, "Post does not exist");
    }

    // extract data from request body
    let { title, content } = req.body;
    title = title?.trim();
    content = content?.trim();

    if (!title || !content) {
      throw new ApiError(400, "All fields required");
    }

    // update post
    const updatedPost = await prisma.post.update({
      where: { id },
      data: {
        title,
        content,
      },
    });

    res.status(200).json({ success: true, updatedPost });
  } catch (err) {
    if (err instanceof Error) {
      throw new ApiError(500, err.message, [err]);
    }
    throw new ApiError(500, "Something went wrong", [err]);
  }
};

// delete post
export const handleDeletePost = async (req: Request, res: Response) => {
  try {
    // extract post id
    const { id } = req.params;

    // validate id
    if (!id || Array.isArray(id)) {
      throw new ApiError(400, "Post does not exist");
    }

    const deletePost = prisma.post.delete({ where: { id } });

    res.status(200).json({ success: true, deletePost});
  } catch (err) {
    if (err instanceof Error) {
      throw new ApiError(500, err.message, [err]);
    }
    throw new ApiError(500, "Something went wrong", [err]);
  }
};
