import express from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { getUserModel, userExists } from "../models/User.js";
import { getAccountModel } from "../models/AccountSchema.js";
import {
  signUpSchema,
  logInSchema,
  updateUserSchema,
} from "../validations/userValidation.js";
import { authMiddleware } from "../middleware/auth.js";
import { PaytmDb } from "../config/db.js";
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;

export default function paytmUserRoutes() {
  const router = express.Router();
  const Users = getUserModel(PaytmDb);

  router.post("/signUp", async (req, res) => {
    try {
      console.log("inside signup route");
      console.log(req.body);
      const result = signUpSchema.safeParse(req.body);

      if (!result.success) {
        return res.status(400).json({
          message: "Email already taken / Incorrect inputs",
        });
      }

      const { name, email, password } = result.data;

      const exists = await userExists(email, Users);
      if (exists)
        return res
          .status(400)
          .json({ message: "Email already taken / Incorrect inputs" });

      const newUser = await Users.create({ name, email, password });

      const userId = newUser._id;

      const Accounts = getAccountModel();
      await Accounts.create({
        userId,
        balance: 1 + Math.floor(Math.random() * 1000),
      });

      const token = jwt.sign(
        { id: newUser._id, email: newUser.email, name: newUser.name },
        JWT_SECRET,
        { expiresIn: "7d" }
      );

      res.json({ message: "Signup successful", token, user: { name, email } });
    } catch (error) {
      console.error("Error during signup:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  router.post("/logIn", async (req, res) => {
    try {
    const result = logInSchema.safeParse(req.body);

    if (!result.success) {
        return res.status(400).json({
          message: "Email already taken / Incorrect inputs",
        });
      }

    const { email, password } = result.data;

    const user = await userExists(email, Users);
    if (!user) {
      return res
        .status(400)
        .json({ message: "User does not exist. Please sign up first." });
    }

    if (user.password !== password) {
      return res.status(400).json({ message: "Incorrect inputs" });
    }

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
    } catch (error) {
      console.error("Error during login:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // router.put("/update", authMiddleware(PaytmDb), async (req, res) => {
  //   const result = updateUserSchema.safeParse(req.body);
  //   if (!result.success) {
  //     return res.status(400).json({
  //       message: result.error.issues[0].message,
  //     });
  //   }
  //   const { name, email, password } = result.data;
  //   const User = req.user;
  //   User.name = name || User.name;
  //   User.password = password || User.password;
  //   await User.save();
  //   res.status(200).json({ message: "User profile updated successfully" });
  // });

  router.get("/users", authMiddleware(PaytmDb), async (req, res) => {
    try {
      const filter = req.query.filter || "";
      const users = await Users.find({
        name: { $regex: filter, $options: "i" },
        _id: { $ne: req.user._id },
      });

      res.json({
        users: users.map((u) => ({ _id: u.id, name: u.name, email: u.email })),
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  router.get("/me", authMiddleware(PaytmDb), async (req, res) => {
    try {
    const user = req.user;
    res.json({ id: user._id, name: user.name, email: user.email });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  return router;
}
