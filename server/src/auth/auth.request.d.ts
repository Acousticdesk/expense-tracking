import { Request } from "express";
import { User } from "./auth.service";

declare module "express-serve-static-core" {
  interface Request {
    user?: User;
  }
}
