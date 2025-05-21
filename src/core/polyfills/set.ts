import {Maybe, MaybeString} from "@/types/core";
import {KeyableObject, WithPrototype} from "@/types/core/objects";
import {configurable, readonly} from "@/core/definer";
import {isDefined, isObject} from "@/core/objects/types";
import {assign} from "@/core/objects/factory";
import {bind} from "@/core/functions/bind";
import {each} from "@/core/iterable/each";
import {len} from "@/core/shortcuts/indexable";
import {clear, forEach} from "@/core/shortcuts/array";
import {concat} from "@/core/shortcuts/string";
import {uid} from "./symbol";
import {get, set} from "@/core/objects/handlers/getset";
import {funclass2} from "@/core/definer/classes/funclass";
import {FunctionClassSimpleStatics} from "@/types/core/definer";
import {deletes, deletesAll} from "@/core/objects/handlers/deletes";
import {descriptor2} from "@/core/definer/shared";
import {mapped} from "@/core/definer/getters/builders";
import {nullable} from "@/core/utils/types";
import {slice} from "@/core/iterable";

type SetSource = Readonly<{
  key: MaybeString,
  already: boolean,
  isObject: boolean,
  index: number
}>;

const setKey = uid("mK"),
  setObjects = uid("mO"),
  setPrimitives = uid("mP");

function item2source<T>($this: Set<T>, item: T): SetSource {
  let key = isObject(item) ? nullable : concat("", item as Object),
    already = false,
    setKeySymbol = get($this, setKey),
    index: number;

  if (!key) {
    index = (item as KeyableObject)[setKeySymbol];
    const source = get($this, setObjects, index);
    source && source !== item && deletes(item, setKeySymbol);
    configurable(item as KeyableObject, setKeySymbol, $this.size);
  } else index = get($this, setPrimitives, key);

  isDefined(index) && (already = get($this, setObjects, index) === item);

  return {
    key,
    already,
    index,
    isObject: !isDefined(key)
  }
}

export interface Set<T> {
  /**
   * Appends a new element with a specified value to the end of the Set.
   */
  add(item: T): this;

  /**
   * Removes a specified value from the Set.
   * @returns Returns true if an element in the Set existed and has been removed, or false if the element does not exist.
   */
  delete(value: T): boolean;

  /**
   * Executes a provided function once per each value in the Set object, in insertion order.
   */
  forEach<R>(callbackfn: (this: R, value: T, value2: T, set: Set<T>) => void, thisArg?: R): void;

  /**
   * @returns a boolean indicating whether an element with the specified value exists in the Set or not.
   */
  has(value: T): boolean;

  /**
   * @returns the number of (unique) elements in Set.
   */
  readonly size: number;

  clear(): void;
}

export interface SetConstructor extends WithPrototype<Set<any>> {
  new<T>(source?: Maybe<ArrayLike<T> | Set<T>>): Set<T>;
}

export const Set: SetConstructor = funclass2({
  construct: function (source) {
    const $this = this,
      isSet = source instanceof Set;

    readonly($this, setObjects, isSet ? slice(get(source, setObjects)) : []);
    readonly($this, setPrimitives, isSet ? assign({}, get(source, setPrimitives)) : {});
    readonly($this, setKey, uid("mS"))

    !isSet && source && each(source, $this.add, $this);
  },
  prototype: <FunctionClassSimpleStatics<Set<any>>>{
    add(item) {
      const $this = this,
        source = item2source($this, item);

      if (!source.already) {
        const size = $this.size;
        source.isObject || set($this, setPrimitives, source.key, size)
        set($this, setObjects, size, item);
      }
      return $this;
    },
    forEach(fn, thisArg) {
      fn = bind(fn, thisArg);
      const $this = this;
      forEach(get($this, setObjects), (value) => fn(value, value, $this));
    },
    has(value) {
      const $this = this,
        source = item2source($this, value);

      return source.already;
    },
    delete(value) {
      const $this = this,
        source = item2source($this, value);

      if (source.already) {
        source.isObject && deletes($this, setPrimitives, source.key!);
        get($this, setObjects,).splice(source.index!, 1);

        return true;
      }

      return false;
    },
    clear() {
      const $this = this,
        primitives = get($this, setPrimitives);
      clear(get($this, setObjects));
      deletesAll(primitives);
    }
  },
  protodescriptor: {
    size: descriptor2(mapped(setObjects, len))
  }
})
