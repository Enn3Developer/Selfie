import e from "express";
import {router as login} from "./login.ts";
import {router as register} from "./register.ts";
import {router as user} from "./user/user.ts";

export function setupRoutes(app: e.Express) {
  app.use("/login", login);
  app.use("/register", register);
  app.use("/user", user);
}