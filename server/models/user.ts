import {ObjectId} from "mongoose";

export default class User {
  _id?: ObjectId | undefined;
  _handle: string;
  _email: string;
  _password: string;
  _displayName: string;

  static CollectionName = "users";

  constructor(handle: string, displayName: string, email: string, password: string, id?: ObjectId | undefined) {
    this._id = id;
    this._handle = handle;
    this._displayName = displayName;
    this._email = email;
    this._password = password;
  }
}