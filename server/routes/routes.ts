import {Express} from "express";

export function setupRoutes(app: Express) {
  app.get("/", (req, res) => {
    res.send("Hello from server!");
  });
}