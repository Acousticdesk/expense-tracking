import { Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { getPgQueryResultRows, pg } from "../services/pg";
import { getUserId, getUserPassword } from "./auth.service";
import { authMiddleware } from "./auth.middleware";

export const router = Router();

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    const userQueryResult = await pg.query(
      "SELECT * FROM users WHERE username = $1",
      [username],
    );

    const user = getPgQueryResultRows(userQueryResult)[0];

    if (!user) {
      res.status(401).send();

      return;
    }

    const userPassword = getUserPassword(user);

    if (!(await bcrypt.compare(password, userPassword))) {
      res.status(401).send();

      return;
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET as string);

    res.status(200).json({
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send();
  }
});

router.post("/register", async (req, res) => {
  const client = await pg.connect();

  try {
    const { username, password } = req.body;

    const passwordHash = await bcrypt.hash(password, 10);

    await client.query("BEGIN");

    const userQueryResult = await pg.query(
      "INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *",
      [username, passwordHash],
    );

    const user = getPgQueryResultRows(userQueryResult)[0];

    await pg.query(
      "INSERT INTO categories (title, color_id, user_id) SELECT title, color_id, $1 FROM default_categories;",
      [getUserId(user)],
    );

    await client.query("COMMIT");

    res.status(201).send();
  } catch (error) {
    await client.query("ROLLBACK");
    console.error(error);
    res.status(500).send();
  }

  client.release();
});

router.get("/me", authMiddleware, async (req, res) => {
  try {
    res.json(req.user);
  } catch (error) {
    console.error(error);
    res.status(500).send();
  }
});
