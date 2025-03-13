import { Router } from "express";
import { getPgQueryResultRows, pg } from "../services/pg";
import { Category, getCategoryId, getCategoryUserId } from "./categories";
import {
  Transaction,
  getTransactionId,
} from "../transactions/transactions.service";
import { QueryResult } from "pg";
import { authMiddleware } from "../auth/auth.middleware";
import { getUserId } from "../auth/auth.service";

export const router = Router();

router.get("/", authMiddleware, async (req, res) => {
  const categoriesQueryResult = await pg.query(
    "SELECT c.*, cc.hash as color_hash, cc.id as color_id FROM categories c LEFT JOIN category_colors cc ON c.color_id = cc.id WHERE c.user_id = $1",
    [getUserId(req.user)],
  );

  const categories = getPgQueryResultRows(categoriesQueryResult);

  res.json({ categories });
});

router.get("/:categoryId", authMiddleware, async (req, res) => {
  const { categoryId } = req.params;

  const categoryQueryResult = await pg.query(
    "SELECT c.*, cc.hash as color_hash FROM categories c LEFT JOIN category_colors cc ON c.color_id = cc.id WHERE c.id = $1 AND c.user_id = $2",
    [categoryId, getUserId(req.user)],
  );

  const category = getPgQueryResultRows(categoryQueryResult)[0];

  if (!category) {
    res.status(404).json({});
    return;
  }

  res.json(category);
});

router.get("/:categoryId/transactions", authMiddleware, async (req, res) => {
  const { categoryId } = req.params;

  let transactionsQueryResult: QueryResult;

  if (categoryId === "all") {
    transactionsQueryResult = await pg.query(
      "SELECT t.* FROM transactions t LEFT JOIN categories c ON t.category_id = c.id WHERE category_id IS NULL AND c.user_id = $1",
      [getUserId(req.user)],
    );
  } else {
    // todo akicha: this should be a part of the transactions service
    transactionsQueryResult = await pg.query(
      "SELECT t.* FROM transactions t LEFT JOIN categories c ON t.category_id = c.id WHERE category_id = $1 AND c.user_id = $2",
      [categoryId, getUserId(req.user)],
    );
  }

  const transactions = getPgQueryResultRows(transactionsQueryResult);

  res.json({ transactions });
});

router.get("/colors", authMiddleware, async (_, res) => {
  const colorsQueryResult = await pg.query("SELECT * FROM category_colors");

  const colors = getPgQueryResultRows(colorsQueryResult);

  res.json({ colors });
});

router.post("/", authMiddleware, async (req, res) => {
  const client = await pg.connect();

  try {
    const { title, color_id } = req.body;

    await client.query("BEGIN");

    const createCategoriesQueryResult = await pg.query(
      "INSERT INTO categories (title, user_id) VALUES ($1) RETURNING *",
      [title, getUserId(req.user)],
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
    res.status(500).json({});
  }

  client.release();
});

router.post("/:categoryId/transactions", authMiddleware, async (req, res) => {
  const client = await pg.connect();

  try {
    const { categoryId } = req.params;
    const { title, amount, timestamp } = req.body;

    const categoryQueryResult = await pg.query(
      "SELECT * FROM categories WHERE id = $1 AND user_id = $2",
      [categoryId, getUserId(req.user)],
    );
    
    const category = getPgQueryResultRows(categoryQueryResult)[0];

    if (!category) {
      res.status(403).json({});
      return;
    }

    await client.query("BEGIN");

    // todo akicha: this should be a part of the transactions service
    const createTransactionQueryResult = await pg.query(
      "INSERT INTO transactions (timestamp, amount, user_id) VALUES ($1, $2, $3) RETURNING *",
      [
        !isNaN(Number(timestamp))
          ? new Date(Number(timestamp)).toISOString()
          : new Date().toISOString(),
        amount,
        getUserId(req.user)
      ],
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
    res.status(500).json({});
  }

  client.release();
});

router.delete("/:categoryId", async (req, res) => {
  try {
    const { categoryId } = req.params;

    await pg.query("DELETE FROM categories WHERE id = $1 AND user_id = $2", [categoryId, getUserId(req.user)]);

    res.json({});
  } catch (error) {
    console.error(error);
    res.status(500).json({});
  }
});
