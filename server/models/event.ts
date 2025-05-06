class Event {
  private _start: Date;
  private _end: Date;
  private _name: string;
  private _description: string;

  constructor(start: Date, end: Date, name: string, description: string) {
    this._start = start;
    this._end = end;
    this._name = name;
    this._description = description;
  }

  get start(): Date {
    return this._start;
  }

  get end(): Date {
    return this._end;
  }

  get name(): string {
    return this._name;
  }

  get description(): string {
    return this._description;
  }

  set start(value: Date) {
    this._start = value;
  }

  set end(value: Date) {
    this._end = value;
  }

  set name(value: string) {
    this._name = value;
  }

  set description(value: string) {
    this._description = value;
  }
}

export {Event}