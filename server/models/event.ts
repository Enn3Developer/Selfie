import {ObjectId} from "mongodb";

export default class Event {
  /// described as the epoch
  _start: number;
  /// described as the epoch
  _end: number;
  _name: string;
  _description: string;
  _userId: ObjectId;
  _id?: string;

  static CollectionName = "events";

  constructor(start: number, end: number, name: string, description: string, userId: ObjectId, id?: string) {
    this._start = start;
    this._end = end;
    this._name = name;
    this._description = description;
    this._userId = userId;
    this._id = id;
  }
}