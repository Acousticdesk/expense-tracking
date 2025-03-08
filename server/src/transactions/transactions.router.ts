import { Router } from "express";
import { getPgQueryResultRows, pg } from "../services/pg";

export const router = Router();

router.get("/", async (_, res) => {
  const transctionsQueryResult = await pg.query("SELECT * FROM transactions");

  const transactions = getPgQueryResultRows(transctionsQueryResult);

  res.json({ transactions });
});

router.post("/", async (req, res) => {
  const { title, amount } = req.body;

  const createTransactionQueryResult = await pg.query(
    "INSERT INTO transactions (title, timestamp, amount) VALUES ($1, $2, $3) RETURNING *",
    [title, new Date().toISOString(), amount],
  );

  const transaction = getPgQueryResultRows(createTransactionQueryResult)[0];

  res.json(transaction);
});

router.delete("/:transactionId", async (req, res) => {
    const { transactionId } = req.params;

    await pg.query("DELETE FROM transactions WHERE id = $1", [transactionId]);

    res.status(200).send();

});
