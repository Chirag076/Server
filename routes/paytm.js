import express from "express";
import paytmUserRoutes from "./paytmUserRoutes.js";
import paytmAccountRoutes from "./paytmAccountRoutes.js";
import { PaytmDb } from "../config/db.js";
import { authMiddleware } from "../middleware/auth.js";
export default function paytmRoutes() {
    const router = express.Router();
    router.use("/user", paytmUserRoutes());
    router.use("/account",authMiddleware(PaytmDb),paytmAccountRoutes());
    router.get("/" ,(req, res) => {
        res.json({ message: "Paytm Route" });
    });
    return router;
}
