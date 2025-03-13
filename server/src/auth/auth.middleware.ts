import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { getPgQueryResultRows, pg } from "../services/pg";
import { DecodedUserToken } from "./auth.service";

export async function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    res.status(401).json({});
    return;
  }

  const token = authorization?.split(" ")[1];

  if (!token) {
    console.log("No token found in the request. Aborting.");
    res.status(401).json({});
    return;
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string,
    ) as DecodedUserToken;

    const userQueryResult = await pg.query(
      "SELECT * FROM users WHERE id = $1",
      [decoded.id],
    );
    const user = getPgQueryResultRows(userQueryResult)[0];

    if (!user) {
      throw new Error("No user found");
    }

    req.user = user;
  } catch (error) {
    if (error instanceof Error && error.name === "TokenExpiredError") {
      res.status(401).json({ code: "TOKEN_EXPIRED" });
      return;
    }
    console.log(error);
    res.status(401).json({});
    return;
  }

  next();
}
