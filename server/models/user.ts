import {ObjectId} from "mongoose";

export class User {
  readonly _id?: ObjectId | undefined;
  private readonly _handle: string;
  private _email: string;
  private _password: string;
  private _displayName: string;

  static CollectionName = "users";

  constructor(handle: string, displayName: string, email: string, password: string, id?: ObjectId | undefined) {
    this._id = id;
    this._handle = handle;
    this._displayName = displayName;
    this._email = email;
    this._password = password;
  }

  get id(): ObjectId | undefined {
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

  get email(): string {
    return this._email;
  }

  set email(value: string) {
    this._email = value;
  }

  get password(): string {
    return this._password;
  }

  set password(value: string) {
    this._password = value;
  }
}