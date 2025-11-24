import express from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { getUserModel, userExists } from "../models/User.js";

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;

// This function takes a DB connection and returns a router
export default function authRoutes(db) {
  const router = express.Router();
  const Users = getUserModel(db);

  // Sign Up
  router.post("/signUp", async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ message: "All fields are required" });

    const exists = await userExists(email, Users);
    if (exists)
      return res.status(400).json({ message: "User already exists" });

    const newUser = await Users.create({ name, email, password });

    const token = jwt.sign(
      { id: newUser._id, email: newUser.email, name: newUser.name },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ message: "Signup successful", token, user: { name, email } });
  });

  // Log In
  router.post("/logIn", async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password)
      return res
        .status(400)
        .json({ message: "Email and password are required" });

    const user = await userExists(email, Users);
    if (!user)
      return res
        .status(400)
        .json({ message: "User does not exist. Please sign up first." });

    if (user.password !== password)
      return res.status(400).json({ message: "Incorrect password" });

    const token = jwt.sign(
      { id: user._id, email: user.email, name: user.name },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: { name: user.name, email: user.email },
    });
  });

  return router;
}
