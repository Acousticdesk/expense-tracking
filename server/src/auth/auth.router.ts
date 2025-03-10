import { Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { getPgQueryResultRows, pg } from "../services/pg";
import { getUserPassword } from "./auth.service";

export const router = Router();

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

  const userQueryResult = await pg.query("SELECT * FROM users WHERE username = $1", [username]);

  const user = getPgQueryResultRows(userQueryResult)[0];

  if (!user) {
    res.status(401).send();

    return;
  }

  const userPassword = getUserPassword(user);

  if (!await bcrypt.compare(password, userPassword)) {
    res.status(401).send();

    return;
  }

  console.log(process.env, 'the env')

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
  try {
    const { username, password } = req.body;

    const passwordHash = await bcrypt.hash(password, 10);

    await pg.query(
      "INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *",
      [username, passwordHash],
    );

    res.status(201).send();
  } catch (error) {
    console.error(error);
    res.status(500).send();
  }
});

