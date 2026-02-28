import { Router } from "express";

const route = Router();

// add new blog route
route.get("/add-new", (req, res) => res.render("addBlog", { user: req.user }));

export default route;
