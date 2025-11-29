import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import connectDB from "./utils/db"; // <-- YOU FORGOT TO RUN THIS
import { recipeRouter } from "./routes/recipeRoutes";
import path from "path";




const app = express();

// Connect to MongoDB BEFORE routes
connectDB();

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(cors());
app.use(express.static(path.join(__dirname, "../../frontend/dist")));

app.get("*", (_req, res) => {
  res.sendFile(path.join(__dirname, "../../frontend/dist/index.html"));
});

app.use("/api/recipes", recipeRouter);
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


