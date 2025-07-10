import express from "express";
import cors from "cors";
import {setupRoutes} from "./routes/routes.js";
import {cleanUpTokens, deserialize, serialize} from "./token.js";
import {connectToDb} from "./services/database.service.js";

const app = express();
// 5 minutes
const CLEANUP_TIME = 15 * 1000;

connectToDb().catch(console.dir);

await deserialize();

app.use(cors());
app.use(express.json());

setupRoutes(app);

setInterval(cleanUpTokens, CLEANUP_TIME);
setInterval(serialize, CLEANUP_TIME);

app.listen(8000, "0.0.0.0", () => {
  console.log("server listening on port 8000");
});