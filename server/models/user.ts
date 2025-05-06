class User {
  private readonly _id: string;
  private readonly _handle: string;
  private _displayName: string;

  constructor(id: string, handle: string, displayName: string) {
    this._id = id;
    this._handle = handle;
    this._displayName = displayName;
  }

  get id(): string {
    return this._id;
  }

  get handle(): string {
    return this._handle;
  }

  get displayName(): string {
    return this._displayName;
  }

  set displayName(value: string) {
    this._displayName = value;
  }
}

export {User}