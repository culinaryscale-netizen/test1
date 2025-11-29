import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import connectDB from "./utils/db"; // <-- YOU FORGOT TO RUN THIS
import { recipeRouter } from "./routes/recipeRoutes";

const app = express();

// Connect to MongoDB BEFORE routes
connectDB();

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(cors());

app.use("/api/recipes", recipeRouter);
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


