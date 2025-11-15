import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
const app = express();
const MONGO_URI = process.env.MONGO_URI;
const JWT_SECRET = process.env.JWT_SECRET;
const PORT = process.env.PORT || 3000;
app.use(express.json());
app.use(cors());
mongoose
  .connect(MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log("MongoDB Error:", err));

const Users = mongoose.model(
  "users",
  new mongoose.Schema({
    name: String,
    email: String,
    password: String,
  })
);
function userExists(email) {
  return Users.findOne({ email });
}
app.get("/", (req, res) => res.send("Server is running"));
app.get("/add", (req, res) => {
  const a = Number(req.query.a);
  const b = Number(req.query.b);
  if (isNaN(a) || isNaN(b)) {
    return res.status(400).json({
      error: "Both 'a' and 'b' must be valid numbers",
      received: { a: req.query.a, b: req.query.b }
    });
  }
  const sum = a + b;
  res.json({ result: sum });
});

app.post("/signUp", async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }
  const exists = await userExists(email);
  if (exists) {
    return res.status(400).json({ message: "User already exists" });
  }
  await Users.create({ name, email, password });
  res.json({
    message: "Signup successful",
    user: { name, email },
  });
});
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
