import { Router } from "express";
import { loginUser, registerUser } from "../controllers/user.controller.js";
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

export default router;
