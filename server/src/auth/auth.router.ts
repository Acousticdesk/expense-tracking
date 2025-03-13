import { Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { getPgQueryResultRows, pg } from "../services/pg";
import {
  attachRefreshTokenToResponse,
  DecodedRefreshToken,
  findRefreshTokenLRUEntry,
  generateTokens,
  getDeviceIdFromDecodedRefreshToken,
  getUserId,
  getUserIdFromDecodedRefreshToken,
  getUserPassword,
  refreshTokenLRU,
} from "./auth.service";
import { authMiddleware } from "./auth.middleware";

export const router = Router();

// todo akicha: validate the request body and headers
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const deviceId = req.headers["x-device-id"] as string;

    const userQueryResult = await pg.query(
      "SELECT * FROM users WHERE username = $1",
      [username],
    );

    const user = getPgQueryResultRows(userQueryResult)[0];

    if (!user) {
      console.error("User not found for the username: ", username);
      res.status(401).json({});

      return;
    }

    const userPassword = getUserPassword(user);

    if (!(await bcrypt.compare(password, userPassword))) {
      console.error("Invalid password for the user: ", username);
      res.status(401).json({});

      return;
    }

    const userId = getUserId(user);

    const { token, refreshToken } = generateTokens({ userId, deviceId });

    res.json({
      token,
      refreshToken,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({});
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

    res.status(201).json({});
  } catch (error) {
    await client.query("ROLLBACK");
    console.error(error);
    res.status(500).json({});
  }

  client.release();
});

router.post("/refresh-token", async (req, res) => {
  try {
    const { refreshToken } = req.cookies.refreshToken;
    const deviceId = req.headers["x-device-id"] as string;

    if (!refreshToken) {
      console.error(
        "Refresh token is missing for the user id: ",
        getUserId(req.user),
      );

      res.status(401).json({});

      return;
    }

    let decodedRefreshToken: DecodedRefreshToken;

    // todo akicha: remove the nested try/catch
    try {
      decodedRefreshToken = jwt.verify(
        refreshToken,
        process.env.JWT_SECRET as string,
      ) as DecodedRefreshToken;
    } catch (error) {
      console.error(error);
      res.status(401).json({});

      return;
    }

    if (
      !findRefreshTokenLRUEntry({
        userId: getUserIdFromDecodedRefreshToken(decodedRefreshToken),
        deviceId: getDeviceIdFromDecodedRefreshToken(decodedRefreshToken),
        refreshToken,
      })
    ) {
      console.log("invalid refresh token for user id:", getUserId(req.user));
      res.status(401).json({});

      return;
    }

    const { token, refreshToken: newRefreshToken } = generateTokens({
      userId: getUserId(req.user),
      deviceId,
    });

    attachRefreshTokenToResponse(res, newRefreshToken);

    res.json({
      token,
      newRefreshToken,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({});
  }
});

router.get("/me", authMiddleware, async (req, res) => {
  try {
    res.json(req.user);
  } catch (error) {
    console.error(error);
    res.status(500).json({});
  }
});
