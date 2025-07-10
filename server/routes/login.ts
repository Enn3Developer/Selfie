import express from "express";
import {collections} from "../services/database.service.js";
import User from "../models/user.js";
import {generateToken, insertToken} from "../token.js";
import bcrypt from "bcrypt";

export const router = express.Router({mergeParams: true});

interface LoginParameters {
  email: string,
  password: string,
  rememberMe?: boolean | undefined,
}

router.post("/", async (req, res) => {
  let params = req.body as LoginParameters;
  console.log("received request for login");

  try {
    let query = {_email: params.email};
    // @ts-ignore
    let user = (await collections.users!.findOne(query))! as User;

    if (user) {
      if (!await bcrypt.compare(params.password, user._password)) {
        throw "WRONG_PASS";
      }
      let token = generateToken();
      if (!insertToken(token, user._id!.toString(), params.rememberMe)) {
        console.error("special error occurred");
      }
      res.status(200).send({token: token});
    }
  } catch (error) {
    console.error(error);
    res.status(404).send(`failed to find user with email: ${params.email}`);
  }
});