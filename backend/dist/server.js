"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const db_1 = __importDefault(require("./utils/db"));
const recipeRoutes_1 = require("./routes/recipeRoutes");
const path_1 = __importDefault(require("path"));
const app = (0, express_1.default)();
// Connect DB first
(0, db_1.default)();
app.use(express_1.default.json({ limit: "50mb" }));
app.use(express_1.default.urlencoded({ extended: true, limit: "50mb" }));
app.use((0, cors_1.default)());
// API routes
app.use("/api/recipes", recipeRoutes_1.recipeRouter);
// Serve frontend
const frontendDist = path_1.default.join(__dirname, "../../frontend/dist");
app.use(express_1.default.static(frontendDist));
// Correct SPA fallback (regex)
app.get(/^\/(?!api).*/, (_req, res) => {
    res.sendFile(path_1.default.join(frontendDist, "index.html"));
});
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
