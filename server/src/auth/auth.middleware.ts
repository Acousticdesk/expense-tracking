import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { getPgQueryResultRows, pg } from "../services/pg";
import { DecodedUserToken } from "./auth.service";

export async function authMiddleware(req: Request, res: Response, next: NextFunction) {
    const { token } = req.body;

    if (!token) {
        res.status(401).send();
        return;
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as DecodedUserToken;

        const userQueryResult = await pg.query("SELECT * FROM users WHERE id = $1", [decoded.id]);
        const user = getPgQueryResultRows(userQueryResult)[0];

        if (!user) {
            throw new Error("No user found");
        }

        req.user = user;
    } catch (error) {
        res.status(401).send();
        return;
    }

    next();
}