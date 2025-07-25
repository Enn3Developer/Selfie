import express from "express";
import cors from "cors";
import {setupRoutes} from "./routes/routes.js";
import {cleanUpTokens, deserialize, serialize} from "./token.js";
import {connectToDb} from "./services/database.service.js";
import {log} from "./logger.js";

const app = express();
// 5 minutes
const CLEANUP_TIME = 5 * 60 * 1000;
const __dirname = import.meta.dirname;

connectToDb().catch(console.dir);

await deserialize();

app.use(cors());
app.use(express.json());

log("working dir: " + __dirname);

setupRoutes(app, __dirname);

setInterval(cleanUpTokens, CLEANUP_TIME);
setInterval(serialize, CLEANUP_TIME);

app.listen(8000, "0.0.0.0", () => {
  log("server listening on port 8000");
});