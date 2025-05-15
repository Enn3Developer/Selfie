import express from "express";
import {checkToken} from "../../token.ts";

export const router = express.Router({mergeParams: true});

interface CheckTokenParameters {
  token: string;
}

router.post("/check", (req, res) => {
  let params = req.body as CheckTokenParameters;
  let isValid = checkToken(params.token);
  res.status(isValid ? 200 : 401).send("OK");
});