import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import path from "path";

import connectDB from "./utils/db";
import { recipeRouter } from "./routes/recipeRoutes";

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(cors());

// API routes
app.use("/api/recipes", recipeRouter);

// Serve frontend (Render deployment)
const frontendPath = path.join(__dirname, "../../frontend/dist");
app.use(express.static(frontendPath));

// SPA fallback (NO WILDCARD ON EXPRESS 5)
app.use((req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
