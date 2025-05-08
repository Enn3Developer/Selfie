import express from "express";
import {collections} from "../services/database.service.ts";
import {User} from "../models/user.ts";
import {generateToken, insertToken} from "../token.ts";
import bcrypt from "bcrypt";

export const router = express.Router({mergeParams: true});

interface LoginParameters {
  email: string,
  password: string,
  rememberMe?: boolean,
}

router.post("/", async (req, res) => {
  let params = req.body as LoginParameters;

  try {
    let query = {email: params.email};
    // @ts-ignore
    let user = (await collections.users!.findOne(query))! as User;

    if (user) {
      if (!await bcrypt.compare(params.password, user.password)) {
        throw "WRONG_PASS";
      }
      let token = generateToken();
      if (!insertToken(token, user.id!, params.rememberMe)) {
        console.error("special error occurred");
      }
      res.status(200).send({token: token});
    }
  } catch (error) {
    res.status(404).send(`failed to find user with email: ${params.email}`);
  }
});