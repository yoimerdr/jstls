import {Maybe, MaybeString} from "../../types/core";
import {KeyableObject} from "../../types/core/objects";
import {configurable, readonlys} from "../definer";
import {isDefined, isObject} from "../objects/types";
import {deepAssign} from "../objects/factory";
import {keys} from "../objects/handlers/properties";
import {apply} from "../functions/apply";
import {bind} from "../functions/bind";
import {each} from "../iterable/each";
import {len} from "../shortcuts/indexable";
import {forEach} from "../shortcuts/array";
import {concat} from "../shortcuts/string";

type SetSource = Readonly<{
  key: MaybeString,
  already: boolean,
  isObject: boolean,
  index: number
}>;
const setKeySymbol = '[[PolyfillSetKey]]';


function setSource<T>(this: Set<T>, item: T): SetSource {
  let key = isObject(item) ? null : concat(setKeySymbol, ":'", item as Object, "'");
  let already: boolean = false;
  let index: number;
  if (!key) {
    index = (item as KeyableObject)[setKeySymbol];
    if (isDefined(index) && this.__objects__[index] !== item)
      delete (item as KeyableObject)[setKeySymbol];
    configurable(item as KeyableObject, setKeySymbol, this.size);
  } else index = this.__primitives__[key];

  if (isDefined(index))
    already = this.__objects__[index] === item;

  return {
    key,
    already,
    index,
    isObject: !isDefined(key)
  }
}

export class Set<T = any> {
  protected readonly __objects__!: T[];
  protected readonly __primitives__!: KeyableObject<number>;

  constructor(source?: Maybe<ArrayLike<T> | Set<T>>) {
    const isSet = source instanceof Set;
    readonlys(this as Set<T>, {
      __objects__: isSet ? source.__objects__.slice() : [],
      __primitives__: isSet ? deepAssign({}, source.__primitives__) : {}
    });

    if (!isSet && source)
      each(source, this.add, this);
  }

  /**
   * Appends a new element with a specified value to the end of the Set.
   */
  add(item: T): this {
    const source = apply(setSource, this, [item]);
    if (source.already)
      return this;

    if (!source.isObject)
      this.__primitives__[source.key!] = this.size;
    this.__objects__[this.size] = item;

    return this;
  }

  clear(): void {
    this.__objects__.length = 0;
    forEach(keys(this.__primitives__), function (key) {
      delete this[key]
    }, this.__primitives__)
  }

  /**
   * Removes a specified value from the Set.
   * @returns Returns true if an element in the Set existed and has been removed, or false if the element does not exist.
   */
  delete(value: T): boolean {
    const source = apply(setSource, this, [value]);
    if (source.already) {
      if (!source.isObject)
        delete this.__primitives__[source.key!];
      this.__objects__.splice(source.index!, 1)
      return true;
    }
    return false
  };

  /**
   * Executes a provided function once per each value in the Set object, in insertion order.
   */
  forEach<R>(callbackfn: (this: R, value: T, value2: T, set: Set<T>) => void, thisArg?: R): void;
  forEach<R>(callbackfn: (this: R | void, value: T, value2: T, set: Set<T>) => void, thisArg?: R): void {
    callbackfn = bind(callbackfn, thisArg);
    forEach(this.__objects__, function (value) {
      callbackfn(value, value, this);
    }, this);
  }

  /**
   * @returns a boolean indicating whether an element with the specified value exists in the Set or not.
   */
  has(value: T): boolean {
    const source = apply(setSource, this, [value]);
    return source.already;
  }

  /**
   * @returns the number of (unique) elements in Set.
   */
  get size(): number {
    return len(this.__objects__);
  }
}
