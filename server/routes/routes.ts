import e from "express";
import {router as login} from "./login.js";
import {router as register} from "./register.js";
import {router as user} from "./user/user.js";
import * as asyncFs from "node:fs/promises";
import path from "node:path";
import mime from "mime";
import * as fs from "node:fs";

export function setupRoutes(app: e.Express, basePath: string) {
  app.use(async (req, res, next) => {
    if (req.method === "GET") {
      let filePath = path.join(basePath, "public", req.url);
      if (!fs.existsSync(filePath)) {
        res.status(200).type("text/html").send(await asyncFs.readFile(path.join(basePath, "public", "index.html")));
        return;
      }

      if ((await asyncFs.lstat(filePath)).isDirectory()) filePath = path.join(filePath, "index.html");
      let content: Buffer | string = await asyncFs.readFile(filePath);
      let type = mime.getType(filePath) ?? "text/html";
      if (type.includes("html") || type.includes("javascript") || type.includes("css")) content = content.toString();

      res.status(200).type(type).send(content);
    } else {
      next();
    }
  });

  app.use("/login", login);
  app.use("/register", register);
  app.use("/user", user);
}