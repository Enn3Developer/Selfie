import mongoose from "mongoose";
import User from "../models/user.js";
import Event from "../models/event.js";
import Note from "../models/note.js";
import {log, error} from "../logger.js";
import Activity from "../models/activity";

export const collections: {
  users?: mongoose.Collection,
  events?: mongoose.Collection,
  notes?: mongoose.Collection,
  activities?: mongoose.Collection,
} = {};
const uri = `mongodb://artur.peshko:YieHeic5@mongo_artur.peshko/?writeConcern=majority`;

export async function connectToDb() {
  try {
    // Create a Mongoose client with a MongoClientOptions object to set the Stable API version
    await mongoose.connect(uri, {
      serverApi: {version: "1", strict: true, deprecationErrors: true},
      dbName: "Selfie"
    });
    if (!mongoose.connection.db) {
      error("no connection to the database");
      return;
    }
    await mongoose.connection.db.admin().command({ping: 1});
    log("Successfully connected to DB");
    // @ts-ignore
    collections.users = mongoose.connection.db.collection(User.CollectionName);
    // @ts-ignore
    collections.events = mongoose.connection.db.collection(Event.CollectionName);
    // @ts-ignore
    collections.notes = mongoose.connection.db.collection(Note.CollectionName);
    // @ts-ignore
    collections.activities = mongoose.connection.db.collection(Activity.CollectionName);
  } catch (e) {
    error(`error happened during database connection: ${e}`);
    // Ensures that the client will close when you error
    await mongoose.disconnect();
  }
}