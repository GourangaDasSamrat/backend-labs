import { Router } from "express";
import { addNewBlog, getBlogById } from "../controllers/blog.controllers.js";
import { multerUpload } from '../middlewares/multer.middleware.js';

const route = Router();

// add new blog route
route.get("/add-new", (req, res) => res.render("addBlog", { user: req.user }));
route.post("/add-new", multerUpload.single("coverImage"), addNewBlog);

// dynamic blog route
route.get("/:id", getBlogById);

export default route;
