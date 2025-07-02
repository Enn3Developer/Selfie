import express from "express";
import {collections} from "../../services/database.service.ts";
import {ObjectId} from "mongodb";
import {getUserId} from "../../token.ts";
import Note from "../../models/note.ts";

export const router = express.Router({mergeParams: true});

interface NotesParams {
  token: string;
}

interface CreateNoteParams {
  token: string;
  title: string;
  content: string;
}

router.post("/create", async (req, res) => {
  let params = req.body as CreateNoteParams;

  let userId = getUserId(params.token);
  if (userId === null) {
    res.status(401).send("NO_AUTH");
    return;
  }

  try {
    let note = new Note(params.title, params.content, userId);

    // @ts-ignore
    let result = await collections.notes!.insertOne(note);
    if (!result.acknowledged) {
      throw "NO_ACK";
    }

    res.status(201).send("OK");
  } catch (error) {
    res.status(500).send("ERR");
    console.error(error);
  }
});

router.post("/get", async (req, res) => {
  let params = req.body as NotesParams;

  let userId = getUserId(params.token);
  if (userId === null) {
    res.status(401).send("NO_AUTH");
    return;
  }

  let query = {_userId: userId};

  try {
    let sendingNotes = [];
    let notes = collections.notes!.find(query);

    for await (let note of notes) {
      sendingNotes.push(note);
    }

    if (sendingNotes.length === 0) {
      res.status(404).send("NOT_FOUND");
      return;
    }

    res.status(200).send(sendingNotes);
  } catch (error) {
    res.status(500).send("ERR");
    console.error(error);
  }
});

router.post("/get/latest", async (req, res) => {
  let params = req.body as NotesParams;

  let userId = getUserId(params.token);
  if (userId === null) {
    res.status(401).send("NO_AUTH");
    return;
  }

  let query = {_userId: userId};

  try {
    let note = await collections.notes!.find(query).sort({_created_at: -1}).limit(1).next();
    if (note === null) {
      res.status(404).send("NOT_FOUND");
      return;
    }

    res.status(200).send(note);
  } catch (error) {
    res.status(500).send("ERR");
    console.error(error);
  }
});

router.post("/get/:note_id", async (req, res) => {
  let params = req.body as NotesParams;

  let userId = getUserId(params.token);
  if (userId === null) {
    res.status(401).send("NO_AUTH");
    return;
  }

  let query = {_id: new ObjectId(req.params.note_id), _userId: userId};

  try {
    let note = await collections.notes!.findOne(query);
    if (note === null) {
      res.status(404).send("NOT_FOUND");
      return;
    }

    res.status(200).send(note);
  } catch (error) {
    res.status(500).send("ERR");
    console.error(error);
  }
});

router.post("/modify/:note_id", async (req, res) => {
  let params = req.body as CreateNoteParams;

  let userId = getUserId(params.token);
  if (userId === null) {
    res.status(401).send("NO_AUTH");
    return;
  }

  let query = {_id: new ObjectId(req.params.note_id), _userId: userId};

  try {
    let note = await collections.notes!.findOne(query);
    if (note === null) {
      res.status(404).send("NOT_FOUND");
      return;
    }

    note._title = params.title;
    note._content = params.content;

    await collections.notes!.replaceOne(query, note);

    res.status(200).send("OK");
  } catch (error) {
    res.status(500).send("ERR");
    console.error(error);
  }
});

router.post("/delete/:note_id", async (req, res) => {
  let params = req.body as NotesParams;

  let userId = getUserId(params.token);
  if (userId === null) {
    res.status(401).send("NO_AUTH");
    return;
  }

  let query = {_id: new ObjectId(req.params.note_id), _userId: userId};

  try {
    let result = await collections.notes!.deleteOne(query);
    if (!result.acknowledged) {
      throw "NO_ACK";
    }

    res.status(200).send("OK");
  } catch (error) {
    res.status(500).send("ERR");
    console.error(error);
  }
});