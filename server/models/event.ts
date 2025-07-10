import {ObjectId} from "mongodb";

export default class Event {
  /// described as the epoch
  _start: number;
  /// described as the epoch
  _end: number;
  _name: string;
  _description: string;
  _place?: string;
  _userId: ObjectId;
  _id?: string;
  _repeat: boolean;
  _frequency: string;
  _repetitions: number;

  static CollectionName = "events";

  constructor(start: number, end: number, name: string, description: string, userId: ObjectId, repeat: boolean, frequency: string, repetitions: number, place?: string, id?: string) {
    this._start = start;
    this._end = end;
    this._name = name;
    this._description = description;
    this._userId = userId;
    this._repeat = repeat;
    this._frequency = frequency;
    this._repetitions = repetitions;
    this._place = place;
    this._id = id;
  }
}