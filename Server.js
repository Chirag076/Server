import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();
const app = express();

const MONGO_URI1 = process.env.MONGO_URI1;
const MONGO_URI2 = process.env.MONGO_URI2;
const JWT_SECRET = process.env.JWT_SECRET;
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

const TestDb = mongoose.createConnection(MONGO_URI1);
const MainDb = mongoose.createConnection(MONGO_URI2);

TestDb.on("connected", () => console.log("TestDb connected"));
MainDb.on("connected", () => console.log("MainDb connected"));

const Users = TestDb.model(
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

function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; 
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
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
  res.json({ result: a + b });
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
  const newUser = await Users.create({ name, email, password });

  const token = jwt.sign(
    {
      id: newUser._id,
      email: newUser.email,
      name: newUser.name,
    },
    JWT_SECRET,
    { expiresIn: "7d" }
  );
  res.json({
    message: "Signup successful",
    token,
    user: { name, email },
  });
});

app.post("/logIn", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }
  const user = await userExists(email);
  if (!user) {
    return res.status(400).json({ message: "User does not exist. Please sign up first." });
  }
  if (user.password !== password) {
    return res.status(400).json({ message: "Incorrect password" });
  }
  const token = jwt.sign(
    {
      id: user._id,
      email: user.email,
      name: user.name,
    },
    JWT_SECRET,
    { expiresIn: "7d" }
  );

  return res.status(200).json({
    message: "Login successful",
    token,
    user: {
      name: user.name,
      email: user.email,
    }
  });
});

app.get("/profile", authMiddleware, (req, res) => {
  const { name, email } = req.user;

  res.json({
    message: `Welcome, ${name} 🎉`,
    name,
    email
  });
});
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
