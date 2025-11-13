import express from "express";   
const app = express();

app.get("/", (req, res) => res.send("Server is running"));
app.get("/add", (req, res) => {
  const a = parseInt(req.query.a) || 0;
  const b = parseInt(req.query.b) || 0;
  res.json({ result: a + b });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
