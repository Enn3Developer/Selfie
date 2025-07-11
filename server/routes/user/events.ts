import express from "express";
import {getUserId} from "../../token.js";
import Event from "../../models/event.js";
import {collections} from "../../services/database.service.js";
import {ObjectId} from "mongodb";
import {error} from "../../logger.js";

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
  place?: string,
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

  let userId = getUserId(params.token);
  if (userId === null) {
    res.status(401).send("NO_AUTH");
    return;
  }

  try {
    let event = new Event(params.start, params.end, params.name, params.description, userId, params.repeat, params.frequency ?? "", params.repetitions ?? 0, params.place);

    // @ts-ignore
    let result = await collections.events!.insertOne(event);
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

          if (startDate.getTime() > params.end) break;
          if (endDate.getTime() < params.start) {
            if (repetitions != -1) repetitions -= 1;
            continue;
          }

          sendingEvents.push(
            new Event(
              startDate.getTime(), endDate.getTime(), event._name,
              event._description, event._userId, event._repeat,
              event._frequency, event._repetitions, event._id.toString("hex")
            )
          );
          if (repetitions != -1) repetitions -= 1;
        }
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
  } catch (e) {
    res.status(500).send("ERR");
    error(e);
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
  } catch (e) {
    res.status(500).send("ERR");
    error(e);
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
    event._repeat = params.repeat;
    event._frequency = params.frequency;
    event._repetitions = params.repetitions;
    event._place = params.place;

    await collections.events!.replaceOne(query, event);

    res.status(200).send("OK");
  } catch (e) {
    res.status(500).send("ERR");
    error(e);
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
  } catch (e) {
    res.status(500).send("ERR");
    error(e);
  }
});