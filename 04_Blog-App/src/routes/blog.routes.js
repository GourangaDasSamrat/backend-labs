import{multerUpload}from'../middlewares/multer.middleware.js'
import { Router } from "express";
import { addNewBlog } from "../controllers/blog.controllers.js";

const route = Router();

// add new blog route
route.get("/add-new", (req, res) => res.render("addBlog", { user: req.user }));
route.post("/add-new", multerUpload.single("coverImage"), addNewBlog);

export default route;
