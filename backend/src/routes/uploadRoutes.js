
import express from "express";

import {
    uploadFileContent,
    getAllUploads,
    contentId,
    viewIncrement,
    deleteContent,
    updateContent,
    myContent
} from "../controllers/uploadController.js";
import { userVerificationMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/all-uploads", getAllUploads);
router.post("/upload-file", userVerificationMiddleware, uploadFileContent);
router.get("/single-upload/:id", userVerificationMiddleware, contentId);
router.patch("/single-upload/:id/views", userVerificationMiddleware, viewIncrement);

//-----FOR CONTENT OWNER ONLY-----//
router.patch("/update-content/:id", userVerificationMiddleware, updateContent);
router.delete("/delete-content/:id", userVerificationMiddleware, deleteContent);

router.get("/my-content", userVerificationMiddleware, myContent);

export { router };