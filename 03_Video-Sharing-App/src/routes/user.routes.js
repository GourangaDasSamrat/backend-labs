import { Router } from "express";
import {
  changePassword,
  getCurrentUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  registerUser,
  updateAccountAvatar,
  updateAccountCover,
  updateAccountDetails,
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
router.route("/refresh-tokens").post(refreshAccessToken);

// change password
router.route("/change-password").post(verifyAuth, changePassword);

// get current user
router.route("/current-user").get(verifyAuth, getCurrentUser);

// update account details
router.route("/update-account").patch(verifyAuth, updateAccountDetails);

// update account avatar
router
  .route("/avatar")
  .patch(verifyAuth, multerUpload.single("avatar"), updateAccountAvatar);

// update account cover
router
  .route("/cover-image")
  .patch(verifyAuth, multerUpload.single("coverImage"), updateAccountCover);

export default router;
