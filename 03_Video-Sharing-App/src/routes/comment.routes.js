import { Router } from "express";
import {
  addComment,
  deleteComment,
  getVideoComments,
  updateComment,
} from "../controllers/comment.controller.js";
import { verifyAuth } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(verifyAuth);

router.route("/:videoId").get(getVideoComments).post(addComment);
router.route("/channel/:commentId").delete(deleteComment).patch(updateComment);

export default router;
