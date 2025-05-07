import e from "express";
import {router as login} from "./login.ts";

export function setupRoutes(app: e.Express) {
  app.get("/", (req, res) => {
    res.send("Hello from server!");
  });

  app.use("/login", login);
}