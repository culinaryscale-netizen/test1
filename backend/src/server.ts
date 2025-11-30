import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import connectDB from "./utils/db";
import { recipeRouter } from "./routes/recipeRoutes";
import path from "path";

const app = express();

// Connect DB first
connectDB();

// body parsers (single set)
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(cors());

// --- API ROUTES (register APIs BEFORE static/frontend) ---
app.use("/api/recipes", recipeRouter);

// --- Serve frontend build (static) ---
const frontendDist = path.join(__dirname, "../../frontend/dist");
app.use(express.static(frontendDist));

// --- SPA fallback (use '/*' not '*' so path-to-regexp won't mis-parse) ---
app.get("/*", (_req, res) => {
  res.sendFile(path.join(frontendDist, "index.html"));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
