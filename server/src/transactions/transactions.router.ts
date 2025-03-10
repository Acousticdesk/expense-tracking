import { Router } from "express";
import { getPgQueryResultRows, pg } from "../services/pg";
import { getTransactionId, Transaction } from "./transactions.service";
import { authMiddleware } from "../auth/auth.middleware";
import { getUserId } from "../auth/auth.service";
import { get } from "http";

export const router = Router();

// todo akicha: maybe this should be performed somewhere else
router.get("/", authMiddleware, async (req, res) => {
  const HOURS_24_IN_MS = 24 * 60 * 60 * 1000;
  const { start_date, end_date } = req.query;

  const startDateTimestamp = !isNaN(Number(start_date))
    ? new Date(Number(start_date)).toISOString()
    : new Date(Date.now() - HOURS_24_IN_MS).toISOString();

  const endDateTimestamp = !isNaN(Number(end_date))
    ? new Date(Number(end_date)).toISOString()
    : new Date().toISOString();

  const totalQueryResult = await pg.query(
    "SELECT SUM(t.amount) FROM transactions t WHERE t.timestamp BETWEEN $1 AND $2 AND t.user_id = $3",
    [startDateTimestamp, endDateTimestamp, getUserId(req.user)],
  );

  const total = getPgQueryResultRows(totalQueryResult)[0].sum;

  const categoriesSplitQueryResult = await pg.query(
    "SELECT c.id as category_id, cc.hash as category_color_hash, COALESCE(c.title, 'No Category') as category_title, SUM(t.amount) FROM transactions t LEFT JOIN categories c ON t.category_id = c.id LEFT JOIN category_colors cc ON c.color_id = cc.id WHERE t.timestamp BETWEEN $1 AND $2 AND t.user_id = $3 GROUP BY c.id, cc.hash",
    [startDateTimestamp, endDateTimestamp, getUserId(req.user)],
  );

  const categoriesSplit = getPgQueryResultRows(categoriesSplitQueryResult);

  res.json({ total, categoriesSplit });
});

router.post("/", authMiddleware, async (req, res) => {
  const client = await pg.connect();

  try {
    const { title, amount } = req.body;

    await client.query("BEGIN");

    const createTransactionQueryResult = await pg.query(
      "INSERT INTO transactions (timestamp, amount, user_id) VALUES ($1, $2, $3) RETURNING *",
      [new Date().toISOString(), amount, getUserId(req.user)],
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

    await client.query("COMMIT");

    res.json(transaction);
  } catch (error) {
    await client.query("ROLLBACK");
    console.log(error, "the error");
    res.status(500).send();
  }

  client.release();
});

router.delete("/:transactionId", authMiddleware, async (req, res) => {
  const { transactionId } = req.params;

  await pg.query("DELETE FROM transactions WHERE id = $1 AND user_id = $2", [
    transactionId,
    getUserId(req.user),
  ]);

  res.status(200).send();
});
