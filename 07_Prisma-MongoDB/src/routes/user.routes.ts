import { Router } from "express";
import { handleUserSignIn, handleUserSignUp } from "../controllers/user.controllers";

const router = Router();

// sign up
router.route("/signup").post(handleUserSignUp);

// sign in
router.route("/signin").get(handleUserSignIn);

export default router;
