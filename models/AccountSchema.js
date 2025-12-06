import mongoose from "mongoose";
import { PaytmDb } from "../config/db.js";

const accountSchema = new mongoose.Schema({
    userId : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true,
    },
    balance: {
        type: Number,
        required: true,
        default: 0,
    }});
// Create a function to get a model on a given DB connection
export function getAccountModel() {
    return PaytmDb.model("accounts", accountSchema);
}
export async function getBalance(userId){
    const accountModel = getAccountModel(PaytmDb);
    const balance = await accountModel.findOne({ userId });
    return balance ? balance.balance : null;
}