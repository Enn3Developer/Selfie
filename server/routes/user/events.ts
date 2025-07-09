import express from "express";
import {getUserId} from "../../token.ts";
import Event from "../../models/event.ts";
import {collections} from "../../services/database.service.ts";
import {ObjectId} from "mongodb";

export const router = express.Router({mergeParams: true});

type EventsParam = {
  token: string,
}

interface CreateEventsParam {
  token: string,
  start: number,
  end: number,
  name: string,
  description: string,
  repeat: boolean,
  frequency?: string,
  repetitions?: number,
}

interface GetEventsParam {
  token: string,
  start: number,
  end: number,
}

function increaseByOffset(date: Date, offset: string): Date {
  switch (offset) {
    case "day":
      return new Date(date.getTime() + 24 * 60 * 60 * 1000);
    case "week":
      return new Date(date.getTime() + 7 * 24 * 60 * 60 * 1000);
    case "month":
      let newDate = new Date(date.getTime());
      newDate.setMonth(date.getMonth() + 1);
      return newDate;
    case "year":
      let newDateYear = new Date(date.getTime());
      newDateYear.setFullYear(date.getFullYear() + 1);
      return newDateYear;
  }

  return date;
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
    let event = new Event(params.start, params.end, params.name, params.description, userId, params.repeat, params.frequency ?? "", params.repetitions ?? 0);

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
      if (event._repeat) {
        let repetitions = event._repetitions;
        let startDate = new Date(event._start);
        let endDate = new Date(event._end);

        while (repetitions > 0 || repetitions == -1) {
          startDate = increaseByOffset(startDate, event._frequency);
          endDate = increaseByOffset(endDate, event._frequency);
          if (event._start > params.end) break;
          if (event._end < params.start) {
            if (repetitions != -1) repetitions -= 1;
            continue;
          }

          sendingEvents.push(event);
          if (repetitions != -1) repetitions -= 1;
        }

        continue;
      }

      if (event._end < params.start) continue;
      if (event._start > params.end) continue;
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