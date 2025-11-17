import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const MONGO_URI1 = process.env.MONGO_URI1;
const MONGO_URI2 = process.env.MONGO_URI2;

export const TestDb = mongoose.createConnection(MONGO_URI1);
export const MainDb = mongoose.createConnection(MONGO_URI2);

TestDb.on("connected", () => console.log("TestDb connected"));
MainDb.on("connected", () => console.log("MainDb connected"));
