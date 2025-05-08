import e from "express";
import {router as login} from "./login.ts";
import {router as register} from "./register.ts";

export function setupRoutes(app: e.Express) {
  app.use("/login", login);
  app.use("/register", register);
}