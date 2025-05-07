import express from "express";

const router = express.Router({mergeParams: true});

router.post("/", (req, res) => {
  console.log(req.body);
  res.send(`successful: ${JSON.stringify(req.body)}`);
});

export {router}