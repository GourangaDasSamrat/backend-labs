import { Router } from "express";
import { signinUser, signupUser } from "../controllers/user.controllers.js";

const router = Router();

router.get("/signin", (_, res) => res.render("signin"));
router.post("/signin", signinUser);

router.get("/signup", (_, res) => res.render("signup"));
router.post("/signup", signupUser);

export default router;
