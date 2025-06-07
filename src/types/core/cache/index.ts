import {EntryLike} from "@jstls/types/core";

export interface CacheEntry<T> extends EntryLike<T> {
  /**
  * Expiry time in milliseconds.
  * */
  expiry?: number;
}
