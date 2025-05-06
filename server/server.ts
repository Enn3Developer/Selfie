import express = require("express");
import cors = require("cors");
import {setupRoutes} from "./routes/routes";

const app = express();

app.use(cors());

setupRoutes(app);

app.listen(8080, () => {
  console.log("server listening on port 8080");
});