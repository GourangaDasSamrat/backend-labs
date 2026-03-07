import { Post } from "@/types/prisma";
import { ApiError } from "@/utils/apiError";
import prisma from "@db";
import { Request, Response } from "express";

// create new post
export const handleCreatePost = async (req: Request, res: Response) => {
  let { slug, title, content, authorId } = req.body;

  slug = slug?.trim();
  title = title?.trim();
  content = content?.trim();

  if (!slug || !title || !content || !authorId) {
    throw new ApiError(400, "All fields required");
  }

  const createPost: Post = await prisma.post.create({
    data: {
      slug,
      title,
      content,
      author: { connect: { id: authorId } },
    },
  });

  res.status(200).json({ success: true, createPost });
};

// update post
export const handleUpdatePost = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id || Array.isArray(id)) {
    throw new ApiError(400, "Post does not exist");
  }

  let { title, content } = req.body;

  title = title?.trim();
  content = content?.trim();

  if (!title || !content) {
    throw new ApiError(400, "All fields required");
  }

  const updatedPost = await prisma.post.update({
    where: { id },
    data: {
      title,
      content,
    },
  });

  res.status(200).json({ success: true, updatedPost });
};

// delete post
export const handleDeletePost = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id || Array.isArray(id)) {
    throw new ApiError(400, "Post does not exist");
  }

  const deletePost = await prisma.post.delete({
    where: { id },
  });

  res.status(200).json({ success: true, deletePost });
};
