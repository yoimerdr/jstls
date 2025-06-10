import {KeyableObject} from "@jstls/types/core/objects";
import {Keys, MethodKeys} from "@jstls/types/core";

export function caller<T extends KeyableObject, K extends MethodKeys<T> = MethodKeys<T>>(key: K) {
  return function (object: T) {
    return object[key]();
  }
}

export function property<T extends KeyableObject, K extends Keys<T> = Keys<T>>(key: K) {
  return function (object: T) {
    return object[key];
  }
}
