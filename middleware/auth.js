import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { getUserModel } from "../models/User.js";

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;


export function authMiddleware(db) {
  return async function (req, res, next) {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET);

      // Create user model for this specific DB
      const User = getUserModel(db);

      // Fetch user
      const user = await User.findById(decoded.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      req.user = user;
      next();

    } catch (err) {
      console.log("Auth error:", err.message);
      return res.status(401).json({ message: "Invalid or expired token" });
    }
  };
}

// export function authMiddleware(req, res, next) {
//   const token = req.headers.authorization?.split(" ")[1];

//   if (!token) return res.status(401).json({ message: "No token provided" });

//   try {
//     const decoded = jwt.verify(token, JWT_SECRET);
//     req.user = decoded;
//     next();
//   } catch (err) {
//     return res.status(401).json({ message: "Invalid or expired token" });
//   }
// }
