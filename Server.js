import express from "express";   
import cors from "cors";
const app = express();
app.use(cors());
app.get("/", (req, res) => res.send("Server is running"));
app.get("/add", (req, res) => {
  const a = parseInt(req.query.a) || 0;
  const b = parseInt(req.query.b) || 0;
  const sum = a + b;
  res.send(sum.toString());
});
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
