import dotenv from "dotenv";
dotenv.config();
import cors from "cors";


import express from "express";
import fileUpload from "express-fileupload";
import cookie from "cookie-parser"


import { router as userRoute } from "./routes/userRoutes.js";
import {router as uploadRoute} from "./routes/uploadRoutes.js";
import { router as assistantRoute } from "./routes/personalAssistantRoutes.js";

const app = express();

app.use(cors());

app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: "16kb" }));
app.use(cookie());

app.use(fileUpload({
    useTempFiles: true,
}));

app.use("/api/auth/v1", userRoute, assistantRoute);
app.use("/api/upload", uploadRoute);

app.get("/", (req, res) => {
    res.send("Welcome to Backend")
});

export { app };