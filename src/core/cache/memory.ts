import {Maybe} from "@jstls/types/core";
import {WithPrototype} from "@jstls/types/core/objects";
import {funclass2} from "@jstls/core/definer/classes/funclass";
import {uid} from "@jstls/core/polyfills/symbol";
import {get2, set, set2} from "@jstls/core/objects/handlers/getset";
import {isNumber} from "@jstls/core/objects/types";
import {indefinite} from "@jstls/core/utils/types";
import {hasKey, keys} from "@jstls/core/objects/handlers/properties";
import {CacheEntry} from "@jstls/types/core/cache";
import {deletes, deletesAll} from "@jstls/core/objects/handlers/deletes";
import {descriptor2} from "@jstls/core/definer/shared";
import {len} from "@jstls/core/shortcuts/indexable";

export interface MemoryCache<T> {

  /**
   * Sets a value in the cache.
   *
   * @example
   * cache.set("key", "value", 5000) // lives for 5 seconds;
   *
   * console.log(cache.get("key")); // "value"
   *
   * setTimeout(function () {
   *   console.log(cache.get("key")); // null
   * }, 6000);
   *
   * @param key The key identifier.
   * @param value The value to set.
   * @param ttl The time to live in milliseconds.
   */
  set(key: string, value: T, ttl?: number): void;

  /**
   * Gets a value from the cache.
   *
   * @param key The key identifier.
   * @returns The value or null if the value is not found or expired.
   */
  get(key: string): Maybe<T>;

  /**
   * Checks if the cache has a value for the given key and has not yet expired.
   *
   * @param key The key identifier.
   */
  has(key: string): boolean;

  /**
   * Deletes the value in the cache for the given key.
   *
   * @param key The key identifier.
   * */
  delete(key: string): void;

  /**
   * Clears the cache.
   * */
  clear(): void;

  /**
   * The number of entries in the cache.
   * */
  readonly size: number;
}

export interface MemoryCacheConstructor extends WithPrototype<MemoryCache<any>> {
  new<T>(): MemoryCache<T>;
}

const storeKey = uid("k");

function isExpired(entry: CacheEntry<any>) {
  return entry.expiry && entry.expiry < (new Date()).getTime();
}

export const MemoryCache: MemoryCacheConstructor = funclass2({
  construct: function () {
    set2(this, storeKey, {});
  },
  prototype: {
    set(key, value, ttl) {
      set(this, storeKey, key, {
        value,
        expiry: isNumber(ttl) ? (new Date()).getTime() + ttl! : indefinite!
      });
    },
    get(key) {
      const source = get2(this, storeKey),
        entry = get2(source, key) as CacheEntry<any>;

      if (entry) {
        if (!isExpired(entry))
          return entry.value;
        deletes(source, key);
      }
      return null;
    },
    has(key) {
      const source = get2(this, storeKey);
      return hasKey(source, key) && !isExpired(get2(source, key));
    },
    delete(key) {
      deletes(this, storeKey, key);
    },
    clear() {
      deletesAll(get2(this, storeKey));
    }
  },
  protodescriptor: {
    size: descriptor2<MemoryCache<any>>(function () {
      return len(keys(get2(this, storeKey)));
    })
  }
});
