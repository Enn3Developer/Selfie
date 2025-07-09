import express from "express";
import {getUserId} from "../../token.ts";
import Event from "../../models/event.ts";
import {collections} from "../../services/database.service.ts";
import {ObjectId} from "mongodb";

export const router = express.Router({mergeParams: true});

type EventsParam = {
  token: string,
}

type CreateEventsParam = EventsParam & {
  start: number,
  end: number,
  name: string,
  description: string,
}

interface GetEventsParam {
  token: string,
  start: number,
  end: number,
}

router.post("/create", async (req, res) => {
  let params = req.body as CreateEventsParam;
  console.log(params);

  let userId = getUserId(params.token);
  if (userId === null) {
    res.status(401).send("NO_AUTH");
    return;
  }

  try {
    let event = new Event(params.start, params.end, params.name, params.description, userId);

    // @ts-ignore
    let result = await collections.events!.insertOne(event);
    if (!result.acknowledged) {
      throw "NO_ACK";
    }

    res.status(200).send("OK");
  } catch (error) {
    res.status(500).send("ERR");
    console.error(error);
  }
});

router.post("/get", async (req, res) => {
  let params = req.body as GetEventsParam;

  let userId = getUserId(params.token);
  if (userId === null) {
    res.status(401).send("NO_AUTH");
    return;
  }

  try {
    let query = {_userId: userId};

    let sendingEvents = [];
    let events = collections.events!.find(query);

    for await (let event of events) {
      if (event._start < params.start) continue;
      if (event._end > params.end) continue;
      sendingEvents.push(event);
    }

    if (sendingEvents.length === 0) {
      res.status(404).send("NOT_FOUND");
      return;
    }

    res.status(200).send(sendingEvents);
  } catch (error) {
    res.status(500).send("ERR");
    console.error(error);
  }
});

router.post("/get/:event_id", async (req, res) => {
  let params = req.body as EventsParam;

  let userId = getUserId(params.token);
  if (userId === null) {
    res.status(401).send("NO_AUTH");
    return;
  }

  let query = {_userId: userId, _id: new ObjectId(req.params.event_id)};

  try {
    let event = await collections.events!.findOne(query);
    if (event === null) {
      res.status(404).send("NOT_FOUND");
      return;
    }

    res.status(200).send(event);
  } catch (error) {
    res.status(500).send("ERR");
    console.error(error);
  }
});

router.post("/modify/:event_id", async (req, res) => {
  let params = req.body as CreateEventsParam;

  let userId = getUserId(params.token);
  if (userId === null) {
    res.status(401).send("NO_AUTH");
    return;
  }

  let query = {_userId: userId, _id: new ObjectId(req.params.event_id)};

  try {
    let event = await collections.events!.findOne(query);
    if (event === null) {
      res.status(404).send("NOT_FOUND");
      return;
    }

    event._start = params.start;
    event._end = params.end;
    event._name = params.name;
    event._description = params.description;

    await collections.events!.replaceOne(query, event);

    res.status(200).send("OK");
  } catch (error) {
    res.status(500).send("ERR");
    console.error(error);
  }
});

router.post("/delete/:event_id", async (req, res) => {
  let params = req.body as EventsParam;

  let userId = getUserId(params.token);
  if (userId === null) {
    res.status(401).send("NO_AUTH");
    return;
  }

  let query = {_userId: userId, _id: new ObjectId(req.params.event_id)};

  try {
    let result = await collections.events!.deleteOne(query);
    if (!result.acknowledged) {
      throw "NO_ACK";
    }

    res.status(200).send("OK");
  } catch (error) {
    res.status(500).send("ERR");
    console.error(error);
  }
});