import {v4 as uuidv4} from 'uuid';
import {ObjectId} from "mongoose";

// TODO: missing implementation to ser/de the token map

let tokenMap: Map<string, [start: number, hours: number, userId: ObjectId]> = new Map();

// Generates a new random token
export function generateToken(): string {
  // generate a random uuid v4
  return uuidv4();
}

// Checks if a token is currently valid
//
// @params token: the token to check
// @returns whether the token is valid or not
export function checkToken(token: string): boolean {
  // check if the token exists in the map
  if (!tokenMap.has(token)) return false;

  // get the validity values for the token
  let [startValidity, hours, _] = tokenMap.get(token)!;

  // compute the end of the validity of the token in milliseconds
  let maxValidity = startValidity + hours * 60 * 60 * 1000;

  // get the current time in milliseconds
  let currentTime = Date.now();

  // check if the current time is valid for the token
  if (currentTime >= maxValidity) return false;

  // all checks done, return true because the token is valid
  return true;
}

// Removes invalid tokens
//
// This may take a long time to complete
export function cleanUpTokens() {
  // create a list of removable tokens
  let removableTokens: string[] = [];

  // for each token
  for (let token of tokenMap.keys()) {
    // check if it's valid
    if (checkToken(token)) continue;

    // else add it to the removable tokens
    removableTokens.push(token);
  }

  // remove all invalid tokens
  for (let token of removableTokens) {
    tokenMap.delete(token);
  }
}

// Tries to save the token
//
// @params token: the token to save
// @params userId: the user id associated with this token
// @params special: optional parameter indicating whether the token should have a longer validity
// @returns true if the operation was successful, false otherwise
export function insertToken(token: string, userId: ObjectId, special?: boolean): boolean {
  // check if the token map doesn't have the token already
  if (tokenMap.has(token)) {
    // if it does, return false
    return false;
  }

  // compute the number of hours of validity
  // if the token is special, the number should be equivalent to 30 days
  // else it should be only 30 minutes
  let hours = special ? 30 * 24 : 0.5;

  // get the current time
  let start = Date.now();

  // update the token map
  tokenMap.set(token, [start, hours, userId]);

  return true;
}

// Returns the user id associated with a token
//
// @params token: the token to check for the user id
// @returns the user id if the token was found, `null` otherwise
export function getUserId(token: string): ObjectId | null {
  // check if the token map has the token
  if (!tokenMap.has(token)) {
    // if not, return immediately
    return null;
  }

  // return the user id found from the token
  return tokenMap.get(token)![2];
}