import express from "express";
import cors from "cors";
import {setupRoutes} from "./routes/routes.ts";
import {cleanUpTokens, deserialize, serialize} from "./token.ts";
import {connectToDb} from "./services/database.service.ts";

const app = express();
// 5 minutes
const CLEANUP_TIME = 5 * 60 * 1000;

connectToDb().catch(console.dir);

await deserialize();

app.use(cors());
app.use(express.json());

setupRoutes(app);

setInterval(cleanUpTokens, CLEANUP_TIME);
setInterval(serialize, CLEANUP_TIME);

app.listen(8080, () => {
  console.log("server listening on port 8080");
});