import {ObjectId} from "mongodb";

export default class Activity {
  /// described as the epoch
  _end: number;
  _name: string;
  _description: string;
  _completed: boolean;
  _late?: boolean;
  _originalEnd?: number;
  _userId: ObjectId;
  _id?: string;

  static CollectionName = "activity";

  constructor(end: number, name: string, description: string, completed: boolean, userId: ObjectId, late?: boolean, originalEnd?: number, id?: string) {
    this._end = end;
    this._name = name;
    this._description = description;
    this._completed = completed;
    this._userId = userId;
    this._late = late;
    this._originalEnd = originalEnd;
    this._id = id;
  }
}