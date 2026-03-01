import { Router } from "express";
import { addNewComment } from '../controllers/comment.controllers.js';

const route = Router()

// add new comment
route.post('/add-new/:blogId',addNewComment)

export default route