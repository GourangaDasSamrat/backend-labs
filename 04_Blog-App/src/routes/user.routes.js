import { Router } from "express";
import { signinUser, signoutUser, signupUser } from "../controllers/user.controllers.js";
import { multerUpload } from '../middlewares/multer.middleware.js';

const router = Router();

// sign in
router.get("/signin", (_, res) => res.render("signin"));
router.post("/signin", signinUser);

// sing up
router.get("/signup", (_, res) => res.render("signup"));
router.post("/signup",multerUpload.single('avatar'), signupUser);

// sign out
router.get("/signout", signoutUser);

export default router;
