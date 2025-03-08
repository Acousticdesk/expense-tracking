import { Pool, QueryResult } from "pg";

export const pg = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 5432,
});

export function getPgQueryResultRows(queryResult: QueryResult) {
  return queryResult.rows;
}