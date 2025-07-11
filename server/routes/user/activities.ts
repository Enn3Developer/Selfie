import express from "express";
import {error} from "../../logger.js";
import {getUserId} from "../../token.js";
import Activity from "../../models/activity.js";
import {collections} from "../../services/database.service.js";
import {ObjectId} from "mongodb";

export const router = express.Router({mergeParams: true});

type ActivitiesParam = {
  token: string,
}

interface CreateActivitiesParam {
  token: string,
  end: number,
  name: string,
  description: string,
  completed?: boolean,
}

interface GetActivitiesParam {
  token: string,
  today: number,
}

router.post("/create", async (req, res) => {
  let params = req.body as CreateActivitiesParam;

  let userId = getUserId(params.token);
  if (userId === null) {
    res.status(401).send("NO_AUTH");
    return;
  }

  try {
    let activity = new Activity(params.end, params.name, params.description, params.completed ?? false, userId);

    // @ts-ignore
    let result = await collections.activities!.insertOne(activity);
    if (!result.acknowledged) {
      throw "NO_ACK";
    }

    res.status(200).send("OK");
  } catch (e) {
    res.status(500).send("ERR");
    error(e);
  }
});

router.post("/get", async (req, res) => {
  let params = req.body as GetActivitiesParam;

  let userId = getUserId(params.token);
  if (userId === null) {
    res.status(401).send("NO_AUTH");
    return;
  }

  try {
    let query = {_userId: userId};

    let sendingActivities = [];
    let activities = collections.activities!.find(query);

    for await (let activity of activities) {
      if (activity._completed) continue;

      if (activity._end < params.today) {
        sendingActivities.push(new Activity(
          params.today, activity._name, activity._description, activity._completed, userId, activity._id.toString("hex")
        ));
        continue;
      }

      sendingActivities.push(activity);
    }

    if (sendingActivities.length === 0) {
      res.status(404).send("NOT_FOUND");
      return;
    }

    res.status(200).send(sendingActivities);
  } catch (e) {
    res.status(500).send("ERR");
    error(e);
  }
});

router.post("/get/:activity_id", async (req, res) => {
  let params = req.body as GetActivitiesParam;

  let userId = getUserId(params.token);
  if (userId === null) {
    res.status(401).send("NO_AUTH");
    return;
  }

  try {
    let query = {_userId: userId, _id: new ObjectId(req.params.activity_id)};

    let activity = await collections.activities!.findOne(query);
    if (activity === null) {
      res.status(404).send("NOT_FOUND");
      return;
    }

    if (!activity._completed && activity._end < params.today) {
      res.status(200).send(new Activity(
        params.today, activity._name, activity._description, activity._completed, userId, activity._id.toString("hex")
      ));
      return;
    }

    res.status(200).send(activity);
  } catch (e) {
    res.status(500).send("ERR");
    error(e);
  }
});

router.post("/modify/:activity_id", async (req, res) => {
  let params = req.body as CreateActivitiesParam;

  let userId = getUserId(params.token);
  if (userId === null) {
    res.status(401).send("NO_AUTH");
    return;
  }

  try {
    let query = {_userId: userId, _id: new ObjectId(req.params.activity_id)};

    let activity = await collections.activities!.findOne(query);
    if (activity === null) {
      res.status(404).send("NOT_FOUND");
      return;
    }

    activity._end = params.end;
    activity._name = params.name;
    activity._description = params.description;
    activity._completed = params.completed ?? false;

    await collections.activities!.replaceOne(query, activity);

    res.status(200).send("OK");
  } catch (e) {
    res.status(500).send("ERR");
    error(e);
  }
});

router.post("/delete/:activity_id", async (req, res) => {
  let params = req.body as ActivitiesParam;

  let userId = getUserId(params.token);
  if (userId === null) {
    res.status(401).send("NO_AUTH");
    return;
  }

  try {
    let query = {_userId: userId, _id: new ObjectId(req.params.activity_id)};

    let result = await collections.activities!.deleteOne(query);
    if (!result.acknowledged) {
      throw "NO_ACK";
    }

    res.status(200).send("OK");
  } catch (e) {
    res.status(500).send("ERR");
    error(e);
  }
});