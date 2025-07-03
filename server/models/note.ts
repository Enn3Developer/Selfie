import {ObjectId} from "mongodb";

export default class Note {
  _title: string;
  _content: string;
  _id?: string;
  _created_at: Date;
  _userId: ObjectId;

  static CollectionName = "notes";

  constructor(title: string, content: string, userId: ObjectId, id?: string) {
    this._title = title;
    this._content = content;
    this._userId = userId;
    this._id = id;
    this._created_at = new Date();
  }
}