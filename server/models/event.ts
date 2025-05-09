export default class Event {
  _start: Date;
  _end: Date;
  _name: string;
  _description: string;

  static CollectionName = "events";

  constructor(start: Date, end: Date, name: string, description: string) {
    this._start = start;
    this._end = end;
    this._name = name;
    this._description = description;
  }
}