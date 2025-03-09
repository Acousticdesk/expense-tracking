import { Router } from "express";
import { getPgQueryResultRows, pg } from "../services/pg";
import { Category, getCategoryId } from "./categories";
import {
  Transaction,
  getTransactionId,
} from "../transactions/transactions.service";

export const router = Router();

router.get("/", async (_, res) => {
  const categoriesQueryResult = await pg.query("SELECT c.*, cc.hash as color_hash, cc.id as color_id FROM categories c LEFT JOIN category_colors cc ON c.color_id = cc.id");

  const categories = getPgQueryResultRows(categoriesQueryResult);

  res.json({ categories });
});

router.get("/:categoryId/transactions", async (req, res) => {
  const { categoryId } = req.params;

  // todo akicha: this should be a part of the transactions service
  const transactionsQueryResult = await pg.query(
    "SELECT * FROM transactions WHERE category_id = $1",
    [categoryId],
  );

  const transactions = getPgQueryResultRows(transactionsQueryResult);

  res.json({ transactions });
});

router.get("/colors", async (_, res) => {
  const colorsQueryResult = await pg.query("SELECT * FROM category_colors");

  const colors = getPgQueryResultRows(colorsQueryResult);

  res.json({ colors });
});

router.post("/", async (req, res) => {
  const client = await pg.connect();

  try {
    const { title, color_id } = req.body;

    await client.query("BEGIN");

    const createCategoriesQueryResult = await pg.query(
      "INSERT INTO categories (title) VALUES ($1) RETURNING *",
      [title],
    );

    const category = getPgQueryResultRows(
      createCategoriesQueryResult,
    )[0] as Category;

    if (title) {
      await pg.query("UPDATE categories SET title = $1 WHERE id = $2", [
        title,
        getCategoryId(category),
      ]);
    }

    if (color_id) {
      await pg.query("UPDATE categories SET color_id = $1 WHERE id = $2", [
        color_id,
        getCategoryId(category),
      ]);
    }

    await client.query("COMMIT");

    res.json(category);
  } catch (error) {
    // todo akicha: properly handle the pg transaction error and only rollback if it's a pg error
    await client.query("ROLLBACK");
    console.log(error, "the error");
    res.status(500).send();
  }

  client.release();
});

router.post("/:categoryId/transactions", async (req, res) => {
  const client = await pg.connect();

  try {
    const { categoryId } = req.params;
    const { title, amount } = req.body;

    await client.query("BEGIN");

    // todo akicha: this should be a part of the transactions service
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

    if (categoryId) {
      await pg.query("UPDATE transactions SET category_id = $1 WHERE id = $2", [
        categoryId,
        getTransactionId(transaction),
      ]);
    }

    await client.query("COMMIT");

    res.json(transaction);
  } catch (error) {
    // todo akicha: properly handle the pg transaction error and only rollback if it's a pg error
    await client.query("ROLLBACK");
    console.log(error, "the error");
    res.status(500).send();
  }

  client.release();
});

router.delete("/:categoryId", async (req, res) => {
  const { categoryId } = req.params;

  await pg.query("DELETE FROM categories WHERE id = $1", [categoryId]);

  res.status(200).send();
});
