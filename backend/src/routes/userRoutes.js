import dotenv from "dotenv";
import express from "express";

import {
  registerUser,
  loginUser,
  logoutUser,
  updateUser,
  toogleFollow,
} from "../controllers/userController.js";
import { userVerificationMiddleware } from "../middlewares/authMiddleware.js";


dotenv.config();
const router = express.Router();

router.post("/register", registerUser);
router.post("/login",loginUser);

router.post("/logout", userVerificationMiddleware, logoutUser);
router.patch("/follow/:channelId", userVerificationMiddleware, toogleFollow);
router.put("/edit/profile/:id", userVerificationMiddleware, updateUser);

export { router };
