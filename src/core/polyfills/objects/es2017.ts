import {Keys, KeysType} from "../../../types/core";
import {keys} from "../../objects/handlers/properties";

export function entries<T>(object: T): [Keys<T>, T[Keys<T>]][] {
  return keys(object)
    .map(key => [key, object[key]])
}

export function values<T>(object: T): KeysType<T>[] {
  return keys(object)
    .map(key => object[key])
}
