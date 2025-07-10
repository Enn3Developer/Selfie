import express from "express";
import {router as notes} from "./notes";
import {router as events} from "./events";
import {router as token} from "./checkToken";

export const router = express.Router({mergeParams: true});

router.use("/notes", notes);
router.use("/token", token);
router.use("/events", events);