import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import { TestDb, MainDb } from "./config/db.js";
import authRoutes from "./routes/auth.js";
import profileRoutes from "./routes/profile.js";
import mathRoutes from "./routes/math.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(express.json());
app.use(cors());

// Routes
app.use("/auth", authRoutes);
app.use("/profile", profileRoutes);
app.use("/math", mathRoutes);

// Health check
app.get("/", (req, res) => res.send("Server is running"));

// 404 Handler
app.use((req, res) => res.status(404).json({ message: "Route not found" }));

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
