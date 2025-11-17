import express from "express";
const router = express.Router();

router.get("/add", (req, res) => {
  const a = Number(req.query.a);
  const b = Number(req.query.b);

  if (isNaN(a) || isNaN(b)) {
    return res.status(400).json({
      error: "Both 'a' and 'b' must be valid numbers",
      received: { a: req.query.a, b: req.query.b },
    });
  }

  res.json({ result: a + b });
});

export default router;
