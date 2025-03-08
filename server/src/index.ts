import 'dotenv/config'
import express, { Request, Response, json } from "express";
import { router as transactionsRouter } from "./transactions/transactions.router";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(json());

app.use("/transactions", transactionsRouter);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

process.on("unhandledRejection", (reason) => {
  console.error(reason);
});
