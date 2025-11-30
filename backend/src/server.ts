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

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(cors());

// API routes
app.use("/api/recipes", recipeRouter);

// Serve frontend
const frontendDist = path.join(__dirname, "../../frontend/dist");
app.use(express.static(frontendDist));

// Correct SPA fallback (regex)
app.get(/^\/(?!api).*/, (_req, res) => {
  res.sendFile(path.join(frontendDist, "index.html"));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
