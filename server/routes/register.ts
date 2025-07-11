import express from "express";
import bcrypt from "bcrypt";
import {collections} from "../services/database.service.js";
import User from "../models/user.js";
import {generateToken, insertToken} from "../token.js";
import {error, log} from "../logger.js";

export const router = express.Router({mergeParams: true});

interface RegisterParameters {
  email: string,
  password: string,
  handle: string,
  displayName: string,
  rememberMe?: boolean | undefined,
}

router.post("/", async (req, res) => {
  let params = req.body as RegisterParameters;
  log("received request for registration");

  try {
    let query = {_email: params.email};
    let queryResult = (await collections.users!.findOne(query));
    if (queryResult != null) {
      res.status(200).send("EMAIL_FOUND");
      return;
    }

    let password = await bcrypt.hash(params.password, 10);

    let user = new User(params.handle, params.displayName, params.email, password);
    // @ts-ignore
    let result = await collections.users!.insertOne(user);
    if (!result.acknowledged) {
      res.status(500).send("NO_INSERT");
      return;
    }

    let token = generateToken();
    if (!insertToken(token, user._id!.toString(), params.rememberMe)) {
      error("special error occurred");
    }
    res.status(201).send({token: token});
  } catch (e) {
    error(`error during registration: ${e}`)
  }
});