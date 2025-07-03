import {ObjectId} from "mongoose";

export default class Note {
  _title: string;
  _content: string;
  _id?: string;
  _created_at: Date;
  _userId: string;

  static CollectionName = "notes";

  constructor(title: string, content: string, userId: string, id?: string) {
    this._title = title;
    this._content = content;
    this._userId = userId;
    this._id = id;
    this._created_at = new Date();
  }
}