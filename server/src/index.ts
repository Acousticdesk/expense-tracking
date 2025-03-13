import 'dotenv/config'
import express, { json } from "express";
import cors from 'cors';
import cookieParser from "cookie-parser";
import { router as transactionsRouter } from "./transactions/transactions.router";
import { router as categoriesRouter } from "./categories/categories.router";
import { router as authRouter } from "./auth/auth.router";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(json());
app.use(cors());
app.use(cookieParser());

app.use("/transactions", transactionsRouter);
app.use("/categories", categoriesRouter);
app.use("/auth", authRouter);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

process.on("unhandledRejection", (reason) => {
  console.error(reason);
});
