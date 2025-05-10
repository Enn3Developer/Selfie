import {ObjectId} from "mongoose";

export default class Event {
  _start: Date;
  _end: Date;
  _name: string;
  _description: string;
  _id?: ObjectId | undefined;

  static CollectionName = "events";

  constructor(start: Date, end: Date, name: string, description: string, id?: ObjectId | undefined) {
    this._start = start;
    this._end = end;
    this._name = name;
    this._description = description;
    this._id = id;
  }
}