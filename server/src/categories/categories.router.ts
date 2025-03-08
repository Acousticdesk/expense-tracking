import { Router } from "express";
import { getPgQueryResultRows, pg } from "../services/pg";
import { Category, getCategoryId } from "./categories";

export const router = Router();

router.get("/", async (_, res) => {
  const categoriesQueryResult = await pg.query("SELECT * FROM categories");

  const categories = getPgQueryResultRows(categoriesQueryResult);

  res.json({ categories });
});

router.get("/:categoryId/transactions", async (req, res) => {
  const { categoryId } = req.params;

  // todo akicha: this should be a part of the transactions services
  const transactionsQueryResult = await pg.query(
    "SELECT * FROM transactions WHERE category_id = $1",
    [categoryId],
  );

  const transactions = getPgQueryResultRows(transactionsQueryResult);

  res.json({ transactions });
});

router.post("/", async (req, res) => {
  try {
    const { title } = req.body;

    const createCategoriesQueryResult = await pg.query(
      "INSERT INTO categories (title) VALUES ($1) RETURNING *",
      [title],
    );

    const category = getPgQueryResultRows(
      createCategoriesQueryResult,
    )[0] as Category;

    if (title) {
      await pg.query("UPDATE categories SET title = $1 WHERE id = $2", [title, getCategoryId(category)]);
    }

    res.json(category);
  } catch (error) {
    console.log(error, "the error");
    res.status(500).send();
  }
});

router.delete("/:categoryId", async (req, res) => {
  const { categoryId } = req.params;

  await pg.query("DELETE FROM categories WHERE id = $1", [categoryId]);

  res.status(200).send();
});
