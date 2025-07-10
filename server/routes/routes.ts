import e from "express";
import {router as login} from "./login.js";
import {router as register} from "./register.js";
import {router as user} from "./user/user.js";
import express from "express";

export function setupRoutes(app: e.Express) {
  app.use("/public", express.static("public"));

  app.use("/login", login);
  app.use("/register", register);
  app.use("/user", user);
}