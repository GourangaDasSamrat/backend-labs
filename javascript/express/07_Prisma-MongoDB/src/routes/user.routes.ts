import { Router } from "express";
import {
  handleUserSignIn,
  handleUserSignOut,
  handleUserSignUp,
} from "@/controllers/user.controllers";

const router = Router();

// sign up
router.route("/signup").post(handleUserSignUp);

// sign in
router.route("/signin").get(handleUserSignIn);

// sign out
router.route("/signout").get(handleUserSignOut);

export default router;
