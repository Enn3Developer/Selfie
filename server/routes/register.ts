import express from "express";
import bcrypt from "bcrypt";
import {collections} from "../services/database.service";
import User from "../models/user";
import {generateToken, insertToken} from "../token";

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
  console.log("received request for registration");

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
      console.error("special error occurred");
    }
    res.status(201).send({token: token});
  } catch (error) {
    console.error(`error during registration: ${error}`)
  }
});