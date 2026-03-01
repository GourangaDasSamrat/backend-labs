import { Router } from "express";
import {generateShortUrl}from'../controllers/url.controllers.js'

const router = Router()

// generate short url
router.post('/',generateShortUrl)

export default router