import express from "express";
import upload from "../utils/multer.js";
import { uploadProfilePhoto } from "../controllers/upload.controller.js";

const router = express.Router();

router.post("/upload-photo", upload.single("file"), uploadProfilePhoto);

export default router;
