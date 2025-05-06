import express = require("express");
import cors = require("cors");
import {setupRoutes} from "./routes/routes";
import {cleanUpTokens} from "./token";

const app = express();
// 5 minutes
const CLEANUP_TIME = 5 * 60 * 1000;

app.use(cors());

setupRoutes(app);

setInterval(cleanUpTokens, CLEANUP_TIME);

app.listen(8080, () => {
  console.log("server listening on port 8080");
});