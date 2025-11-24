import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
});

// Create a function to get a model on a given DB connection
export function getUserModel(db) {
  return db.model("users", userSchema);
}

// Helper to check if user exists on a given model
export async function userExists(email, UserModel) {
  return UserModel.findOne({ email });
}
