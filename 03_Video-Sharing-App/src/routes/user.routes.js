import { Router } from "express";
import {
  loginUser,
  logoutUser,
  refreshAccessToken,
  registerUser,
} from "../controllers/user.controller.js";
import { verifyAuth } from "../middlewares/auth.middleware.js";
import { multerUpload } from "../middlewares/multer.middleware.js";

const router = Router();

// register user route
router.route("/register").post(
  multerUpload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
    {
      name: "coverImage",
      maxCount: 1,
    },
  ]),
  registerUser
);

// login user route
router.route("/login").post(loginUser);

// logout user route
router.route("/logout").post(verifyAuth, logoutUser);

// refresh tokens
router.route("refresh_tokens").post(refreshAccessToken);

export default router;
