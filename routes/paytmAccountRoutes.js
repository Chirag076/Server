import express from "express";
import { getBalance } from "../models/AccountSchema.js";
import { getAccountModel } from "../models/AccountSchema.js";
import { PaytmDb } from "../config/db.js";
import { transferSchema } from "../validations/userValidation.js";

export default function paytmRoutes() {
  const router = express.Router();

  router.get("/balance", async (req, res) => {
    try {
      const balance = await getBalance(req.user._id);
      res.json({ balance });
    } catch (error) {
      console.error("Error fetching balance:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  router.get("/", (req, res) => {
    res.json({ message: "Paytm Account Route" });
  });
  router.post("/transfer", async (req, res) => {
    try {
      const session = await PaytmDb.startSession();
      session.startTransaction();
      const result = transferSchema.safeParse(req.body);
      if (!result.success) {
        await session.abortTransaction();
        return res.status(400).json({ message: "Invalid Input" });
      }
      const { toAccountId, amount } = result.data;
      const account = await getAccountModel()
        .findOne({ userId: req.user._id })
        .session(session);
      console.log("our account", account);
      if (account.balance < amount) {
        await session.abortTransaction();
        return res.status(400).json({ message: "Insufficient Balance" });
      }

      const toAccount = await getAccountModel()
        .findOne({ userId: toAccountId })
        .session(session);
      console.log("to account", toAccount);
      if (!toAccount) {
        await session.abortTransaction();
        return res.status(400).json({ message: "Invalid Recipient Account" });
      }
      await getAccountModel()
        .updateOne({ _id: account._id }, { $inc: { balance: -amount } })
        .session(session);
      await getAccountModel()
        .updateOne({ _id: toAccount._id }, { $inc: { balance: amount } })
        .session(session);
      await session.commitTransaction();
      session.endSession();
      res.json({ message: "Transfer Successful" });
    } catch (error) {
      console.error("Error during transfer:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  return router;
}
