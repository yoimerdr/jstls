import {Keys} from "../../../types/core";
import {KeyableObject} from "../../../types/core/objects";
import {loop} from "../../utils/iterables";
import {len} from "../../shortcuts/indexable";

export function fromEntries<T>(entries: [Keys<KeyableObject>, T][]): KeyableObject<T> {
  const result: KeyableObject<T> = {};
  loop(index => {
    const value = entries[index];
    if (value && len(value) < 2)
      return;
    result[value[0]] = value[1];
  }, len(entries))

  return result;
}
