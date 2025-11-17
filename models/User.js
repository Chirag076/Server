import mongoose from "mongoose";
import { TestDb } from "../config/db.js";

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
});

export const Users = TestDb.model("users", userSchema);

export function userExists(email) {
  return Users.findOne({ email });
}
