import express from "express";
import {router as notes} from "./notes.js";
import {router as events} from "./events.js";
import {router as token} from "./checkToken.js";

export const router = express.Router({mergeParams: true});

router.use("/notes", notes);
router.use("/token", token);
router.use("/events", events);