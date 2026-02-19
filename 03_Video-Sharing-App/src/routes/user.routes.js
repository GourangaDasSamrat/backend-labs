import { Router } from "express";
import { registerUser } from "../controllers/user.controller.js";
import { multerUpload } from "../middlewares/multer.middleware.js";

const router = Router();

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

export default router;
