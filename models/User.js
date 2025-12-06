import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type :String,
    required: true,
  },
  email: {
    type:String,
    required: true,
    unique: true,
  },
  password: {
    type:String,
    required: true,
    minLength: 6,
  },
});

// Create a function to get a model on a given DB connection
export function getUserModel(db) {
  return db.model("users", userSchema);
}

// Helper to check if user exists on a given model
export async function userExists(email, UserModel) {
  return UserModel.findOne({ email });
}
