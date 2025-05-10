import {ObjectId} from "mongoose";

export default class Note {
  _title: string;
  _content: string;
  _id?: ObjectId | undefined;
  _created_at: Date;
  _userId: ObjectId;

  static CollectionName = "notes";

  constructor(title: string, content: string, userId: ObjectId, id?: ObjectId | undefined) {
    this._title = title;
    this._content = content;
    this._userId = userId;
    this._id = id;
    this._created_at = new Date();
  }
}