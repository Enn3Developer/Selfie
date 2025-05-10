import express from "express";
import {router as notes} from "./notes.ts";

export const router = express.Router({mergeParams: true});

router.use("/notes", notes);