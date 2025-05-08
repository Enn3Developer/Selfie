import mongoose from "mongoose";
import {User} from "../models/user.ts";

export const collections: { users?: mongoose.Collection } = {};
const uri = `mongodb+srv://arturpeshko39:${process.env.PASSWORD}@cluster0.kzp8lsd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

export async function connectToDb() {
  try {
    // Create a Mongoose client with a MongoClientOptions object to set the Stable API version
    let client = await mongoose.connect(uri, {serverApi: {version: "1", strict: true, deprecationErrors: true}});
    if (!mongoose.connection.db) {
      console.error("no connection to the database");
      return;
    }
    await mongoose.connection.db.admin().command({ping: 1});
    console.log("Successfully connected to DB");
    // @ts-ignore
    collections.users = mongoose.connection.db.collection(User.CollectionName);
  } finally {
    // Ensures that the client will close when you finish/error
    await mongoose.disconnect();
  }
}