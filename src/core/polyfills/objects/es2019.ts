import {Keys} from "@jstls/types/core";
import {KeyableObject} from "@jstls/types/core/objects";
import {len} from "@jstls/core/shortcuts/indexable";
import {forEach} from "@jstls/core/shortcuts/array";

export function fromEntries<T>(entries: [Keys<KeyableObject>, T][]): KeyableObject<T> {
  const result: KeyableObject<T> = {};
  forEach(entries, value => {
    if (value && len(value) < 2)
      return;
    result[value[0]] = value[1];
  });
  return result;
}
