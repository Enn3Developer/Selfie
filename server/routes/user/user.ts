import express from "express";
import {router as notes} from "./notes.ts";
import {router as token} from "./checkToken.ts";

export const router = express.Router({mergeParams: true});

router.use("/notes", notes);
router.use("/token", token);