import {Keys, KeysType} from "@jstls/types/core";
import {keys} from "@jstls/core/shortcuts/object";
import {bind} from "@jstls/core/functions/bind";
import {get2} from "@jstls/core/objects/handlers/getset";
import {KeyableObject} from "@jstls/types/core/objects";

export function entries<T>(object: T): [Keys<T>, T[Keys<T>]][] {
  return keys(object)
    .map(key => [key, object[key]])
}

export function values<T>(object: T): KeysType<T>[] {
  return keys(object)
    .map(bind(get2, object, object as KeyableObject))
}
