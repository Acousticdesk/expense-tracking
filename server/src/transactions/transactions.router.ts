import { Router } from "express";
import { getPgQueryResultRows, pg } from "../services/pg";
import { getTransactionId, Transaction } from "./transactions.service";

export const router = Router();

router.get("/", async (_, res) => {
  const transctionsQueryResult = await pg.query("SELECT * FROM transactions");

  const transactions = getPgQueryResultRows(transctionsQueryResult);

  res.json({ transactions });
});

router.post("/", async (req, res) => {
  try {
    const { title, amount } = req.body;

    const createTransactionQueryResult = await pg.query(
      "INSERT INTO transactions (timestamp, amount) VALUES ($1, $2) RETURNING *",
      [new Date().toISOString(), amount],
    );

    const transaction = getPgQueryResultRows(createTransactionQueryResult)[0] as Transaction;

    if (title) {
      await pg.query("UPDATE transactions SET title = $1 WHERE id = $2", [title, getTransactionId(transaction)]);
    }

    res.json(transaction);
  } catch (error) {
    console.log(error, 'the error');
    res.status(500).send();
  }
});

router.delete("/:transactionId", async (req, res) => {
  const { transactionId } = req.params;

  await pg.query("DELETE FROM transactions WHERE id = $1", [transactionId]);

  res.status(200).send();
});
