import { Router } from "express";
import { getPgQueryResultRows, pg } from "../services/pg";
import { getTransactionId, Transaction } from "./transactions.service";

export const router = Router();

// todo akicha: maybe this should be performed somewhere else
router.get("/", async (req, res) => {
  const HOURS_24_IN_MS = 24 * 60 * 60 * 1000;
  const { start_date, end_date } = req.query;
  
  const startDateTimestamp = !isNaN(Number(start_date))
    ? new Date(Number(start_date)).toISOString()
    : new Date(Date.now() - HOURS_24_IN_MS).toISOString();

  const endDateTimestamp = !isNaN(Number(end_date))
    ? new Date(Number(end_date)).toISOString()
    : new Date().toISOString();

  const totalQueryResult = await pg.query(
    "SELECT SUM(t.amount) FROM transactions t WHERE t.timestamp BETWEEN $1 AND $2",
    [startDateTimestamp, endDateTimestamp],
  );

  const total = getPgQueryResultRows(totalQueryResult)[0].sum;

  const categoriesSplitQueryResult = await pg.query(
    "SELECT c.id as category_id, c.title as category_title, SUM(t.amount) FROM transactions t LEFT JOIN categories c ON t.category_id = c.id WHERE t.timestamp BETWEEN $1 AND $2 GROUP BY c.id",
    [startDateTimestamp, endDateTimestamp],
  );

  const categoriesSplit = getPgQueryResultRows(categoriesSplitQueryResult);

  res.json({ total, categoriesSplit });
});

router.post("/", async (req, res) => {
  try {
    const { title, amount } = req.body;

    const createTransactionQueryResult = await pg.query(
      "INSERT INTO transactions (timestamp, amount) VALUES ($1, $2) RETURNING *",
      [new Date().toISOString(), amount],
    );

    const transaction = getPgQueryResultRows(
      createTransactionQueryResult,
    )[0] as Transaction;

    if (title) {
      await pg.query("UPDATE transactions SET title = $1 WHERE id = $2", [
        title,
        getTransactionId(transaction),
      ]);
    }

    res.json(transaction);
  } catch (error) {
    console.log(error, "the error");
    res.status(500).send();
  }
});

router.delete("/:transactionId", async (req, res) => {
  const { transactionId } = req.params;

  await pg.query("DELETE FROM transactions WHERE id = $1", [transactionId]);

  res.status(200).send();
});
