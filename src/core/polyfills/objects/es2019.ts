import {Keys} from "../../../types/core";
import {KeyableObject} from "../../../types/core/objects";
import {loop} from "../../utils";

export function fromEntries<T>(entries: [Keys<KeyableObject>, T][]): KeyableObject<T> {
  const result: KeyableObject<T> = {};
  loop(index => {
    const value = entries[index];
    if(value && value.length < 2)
      return;
    result[value[0]] = value[1];
  }, entries.length)

  return result;
}
