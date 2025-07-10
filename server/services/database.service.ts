import mongoose from "mongoose";
import User from "../models/user.js";
import Event from "../models/event.js";
import Note from "../models/note.js";

export const collections: {
  users?: mongoose.Collection,
  events?: mongoose.Collection,
  notes?: mongoose.Collection
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
      console.error("no connection to the database");
      return;
    }
    await mongoose.connection.db.admin().command({ping: 1});
    console.log("Successfully connected to DB");
    // @ts-ignore
    collections.users = mongoose.connection.db.collection(User.CollectionName);
    // @ts-ignore
    collections.events = mongoose.connection.db.collection(Event.CollectionName);
    // @ts-ignore
    collections.notes = mongoose.connection.db.collection(Note.CollectionName);
  } catch (error) {
    console.error(`error happened during database connection: ${error}`);
    // Ensures that the client will close when you error
    await mongoose.disconnect();
  }
}