import * as util from "node:util";

export function log(content: any) {
  console.log(`${new Date().toLocaleTimeString()} - ${util.inspect(content)}`)
}

export function error(content: any) {
  console.error(`${new Date().toLocaleTimeString()} - ${util.inspect(content)}`)
}