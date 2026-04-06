import {
    handleCreatePost,
    handleDeletePost,
    handleGetAllPosts,
    handleUpdatePost,
} from "@/controllers/post.controllers";
import { isLoggedIn } from "@/middlewares/auth.middleware";
import { Router } from "express";

const router = Router();

// create post
router.route("/create").post(isLoggedIn, handleCreatePost);

// update post
router.route("/update/:id").put(isLoggedIn, handleUpdatePost);

// delete post
router.route("/delete/:id").delete(isLoggedIn, handleDeletePost);

// get all posts
router.route("/get-all").get(isLoggedIn, handleGetAllPosts);

export default router;
