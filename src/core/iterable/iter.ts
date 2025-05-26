import {readonlys2, writeable} from "@jstls/core/definer";
import {coerceAtLeast, coerceAtMost, coerceIn, isFromTo} from "../extensions/number";
import {isEmpty} from "@jstls/core/extensions/shared/iterables";
import {WithPrototype} from "@jstls/types/core/objects";
import {IterEach, IterEachNext, IterEachPrevious, IterMap, IterMatchCondition} from "@jstls/types/core/iterable";
import {Instanceable} from "@jstls/types/core";
import {IllegalAccessError} from "@jstls/core/exceptions/illegal-access";
import {ArrayLike} from "@jstls/types/core/array";
import {apply} from "@jstls/core/functions/apply";
import {uid} from "@jstls/core/polyfills/symbol";
import {get, set} from "@jstls/core/objects/handlers/getset";
import {freeze} from "@jstls/core/shortcuts/object";
import {len} from "@jstls/core/shortcuts/indexable";
import {concat} from "@jstls/core/shortcuts/string";
import {funclass2} from "@jstls/core/definer/classes/funclass";
import {FunctionClassSimpleStatics} from "@jstls/types/core/definer";
import {indefinite} from "@jstls/core/utils/types";

export function iterEachOrFindIndex<T, R>($this: Iter<T>,
                                          restartFn: (this: Iter<T>) => any,
                                          whileFn: (this: Iter<T>) => boolean,
                                          eachFn: IterEach<T, R> | IterEachNext<T, R>,
                                          advanceFn: (this: Iter<T>) => T,
                                          thisArg?: R,
                                          includeAdvance?: boolean,
                                          matchFn?: IterMatchCondition<T>): number {
  const startIndex = $this.index();

  apply(restartFn, $this);
  while (apply(whileFn, $this)) {
    const index = $this.index(),
      current = $this.current(),
      advance = apply(advanceFn, $this);
    if (matchFn && matchFn(current, index))
      return index;
    else if (eachFn)
      apply(eachFn, thisArg!, (includeAdvance ? [current, advance, index] : [current, index]))
  }

  if (startIndex !== $this.index())
    $this.at(startIndex);
  return -1;
}

export function iterMap<T, R, A, I extends Iter<A>>($this: Iter<T>,
                                                    constructor: Instanceable<I, [value: ArrayLike<any>]>,
                                                    iterate: ((this: Iter<T>, fn: IterEach<T, R>, thisArg?: R) => void),
                                                    fn?: IterMap<T, A, R>,
                                                    thisArg?: R,
                                                    condition?: IterMatchCondition<T>,): I {
  const indexable = <ArrayLike<A>>{};
  let index = 0;
  apply(iterate, $this, [
    function (this: R, item) {
      if (!condition || condition(item, index)) {
        indexable[index] = fn ? apply(fn, this, [item, index]) : item as any;
        index++;
      }
    },
    thisArg
  ]);
  indexable.length = index;
  return new constructor(freeze(indexable))
}


export function iterRepresentation($this: Iter<any>, name: string): string {
  return concat(
    "[", $this.length(), "] ",
    name, " { start: ", $this.startIndex, ", end: ", $this.endIndex, ", current: ", $this.index()
  )
}


const iterIndex = uid("mI");

export interface Iter<T> {
  /**
   * The end index of the iter.
   */
  readonly endIndex: number;

  /**
   * The start index of the iter.
   */
  readonly startIndex: number;

  /**
   * The step of the iter.
   */
  readonly step: number;

  /**
   * The source of the iter.
   */
  readonly source: ArrayLike<T>;

  /**
   * Gets the current index of the iter.
   */
  index(): number;

  /**
   * Gets the length of the iter source.
   * @see {@link source}
   */
  length(): number;

  /**
   * Gets the value of the iter at the current index.
   * @see {index}
   * @see {at}
   */
  current(): T;

  /**
   * Gets the value of the iter at the given index.
   * @param index The index to get the value at.
   * @returns The value at the given index.
   */
  at(index: number): T

  /**
   * Gets the previous value of the iter.
   * @returns The previous value of the iter.
   */
  previous(): T

  /**
   * Checks if the iter has a previous value.
   * @returns true if the iter has a previous value, false otherwise.
   */
  hasPrevious(): boolean

  /**
   * Gets the next value of the iter.
   * @returns The next value of the iter.
   */
  next(): T

  /**
   * Checks if the iter has a next value.
   * @returns true if the iter has a next value, false otherwise.
   */
  hasNext(): boolean

  /**
   * Gets the start value of the iter.
   * @returns The start value of the iter.
   */
  start(): T

  /**
   * Gets the end value of the iter.
   * @returns The end value of the iter.
   */
  end(): T

  /**
   * Checks if the iter is out of bounds.
   * @returns true if the iter is out of bounds, false otherwise.
   */
  isOutBounds(): boolean

  /**
   * Checks if the iter is in bounds.
   * @returns true if the iter is in bounds, false otherwise.
   */
  isInBounds(): boolean

  /**
   * Checks if the iter is empty.
   * @returns true if the iter is empty, false otherwise.
   */
  isEmpty(): boolean

  /**
   * Checks if the iter is not empty.
   * @returns true if the iter is not empty, false otherwise.
   */
  isNotEmpty(): boolean

  /**
   * Executes the given function if the iter is not empty.
   * @param fn The function to execute if the iter is not empty.
   * @param thisArg The context of the function.
   * @returns The iter.
   */
  ifNotEmpty<R>(fn: (this: R, iter: this) => void, thisArg?: R): this

  /**
   * Performs the given function for each value of the iter, starting from the {@link startIndex}.
   * @param fn The function to perform for each value.
   * @param thisArg The context of the function.
   * @returns The iter.
   */
  each<R>(fn: IterEach<T, R>, thisArg?: R): this

  /**
   * Performs the given function for each value of the iter, starting from the {@link endIndex}.
   * @param fn The function to perform for each value.
   * @param thisArg The context of the function.
   * @returns The iter.
   */
  reach<R>(fn: IterEach<T, R>, thisArg?: R): this

  /**
   * Performs the given function for each value of the iter, starting from the {@link startIndex}, and returns a new iter with the results.
   * @param fn The function to perform for each value.
   * @param thisArg The context of the function.
   * @returns The new iter.
   */
  map<A, R>(fn: IterMap<T, A, R>, thisArg?: R): Iter<A>

  /**
   * Performs the given function for each value of the iter, starting from the {@link endIndex}, and returns a new iter with the results.
   * @param fn The function to perform for each value.
   * @param thisArg The context of the function.
   * @returns The new iter.
   */
  rmap<A, R>(fn: IterMap<T, A, R>, thisArg?: R): Iter<A>

  /**
   * Performs the given function for each and next value of the iter, starting from the {@link startIndex}.
   * @param fn The function to perform for each and next value.
   * @param thisArg The context of the function.
   * @returns The iter.
   */
  eachnxt<R>(fn: IterEachNext<T, R>, thisArg?: R): this

  /**
   * Performs the given function for each and previous value of the iter, starting from the {@link endIndex}.
   * @param fn The function to perform for each and previous value.
   * @param thisArg The context of the function.
   * @returns The iter.
   */
  eachprv<R>(fn: IterEachPrevious<T, R>, thisArg?: R): this

  /**
   * Converts the iter to an array.
   * @returns The array.
   */
  toArray(): T[]

  toString(): string;
}

export interface IterConstructor extends WithPrototype<Iter<any>> {
  new<T>(source: ArrayLike<T> | Iter<T>, start?: number, end?: number, step?: number): Iter<T>;
}

/**
 * The iter class for iterating over a indexable object.
 * @class
 */
export const Iter: IterConstructor = funclass2({
  construct: function (source, start, end, step) {
    if (source instanceof Iter) {
      start = source.startIndex;
      end = source.endIndex;
      step = source.step;
      source = source.source;
    } else if (len(source) > 0) {
      step = coerceAtLeast(1, step || 0);
      const size = len(source);
      if (step! > size)
        throw new IllegalAccessError("The step cannot be greater than the source length");
      start = coerceAtMost(size, start || 0,);
      end = coerceIn(start, size, end || size - 1,);
    } else {
      start = end = 0;
      step = 1;
    }

    const $this = this;

    readonlys2($this, {
      startIndex: start,
      endIndex: end,
      step,
      source
    });

    writeable($this, iterIndex, start);
  },
  prototype: <FunctionClassSimpleStatics<Iter<unknown>>>{
    index() {
      return get(this, iterIndex);
    },
    length() {
      return len(this.source);
    },
    current() {
      const $this = this;
      return $this.isOutBounds() ? indefinite! : $this.at($this.index());
    },
    at(index) {
      const $this = this;
      if (index < 0)
        index += $this.endIndex + 1;
      const target = coerceIn($this.startIndex, $this.endIndex, index,);
      if (target !== index)
        return indefinite!;

      set($this, iterIndex, target);
      return $this.source[target];
    },
    previous() {
      const $this = this;
      set($this, iterIndex, coerceAtLeast($this.startIndex - $this.step, $this.index() - $this.step,));
      return $this.source[$this.index()];
    },
    hasPrevious() {
      const $this = this;
      return $this.index() - $this.step >= $this.startIndex;
    },
    next() {
      const $this = this;
      set($this, iterIndex, coerceAtMost($this.endIndex + $this.step, $this.index() + $this.step,));
      return $this.source[$this.index()];
    },
    hasNext() {
      const $this = this;
      return $this.index() + $this.step <= $this.endIndex;
    },
    start() {
      const $this = this;
      return $this.at($this.startIndex);
    },
    end() {
      const $this = this;
      return $this.at($this.endIndex);
    },
    isOutBounds() {
      const $this = this;
      return $this.isEmpty() || !isFromTo($this.startIndex, $this.endIndex, $this.index(),);
    },
    isInBounds() {
      return !this.isOutBounds();
    },
    isEmpty() {
      return isEmpty(this.source);
    },
    isNotEmpty() {
      return !this.isEmpty();
    },
    ifNotEmpty(fn, thisArg) {
      const $this = this;
      $this.isNotEmpty() && apply(fn, thisArg, [$this]);
      return $this;
    },
    each(fn, thisArg) {
      const $this = this;
      iterEachOrFindIndex($this, $this.start, $this.isInBounds, fn, $this.next, thisArg);
      return this;
    },
    reach(fn, thisArg) {
      const $this = this;
      iterEachOrFindIndex($this, $this.end, $this.isInBounds, fn, $this.previous, thisArg);
      return $this;
    },
    map(fn, thisArg) {
      const $this = this;
      return iterMap($this, Iter, $this.each, fn, thisArg);
    },
    rmap(fn, thisArg) {
      const $this = this;
      return iterMap($this, Iter, $this.reach, fn, thisArg);
    },
    eachnxt(fn, thisArg) {
      const $this = this;
      iterEachOrFindIndex($this, $this.start, $this.hasNext, fn, $this.next, thisArg, true);
      return $this;
    },
    eachprv(fn, thisArg) {
      const $this = this;
      iterEachOrFindIndex($this, $this.end, $this.hasPrevious, fn, $this.previous, thisArg, true);
      return $this;
    },
    toArray() {
      const result: any[] = []
      this.each(value => result.push(value),);
      return result;
    },
    toString() {
      return iterRepresentation(this, 'Iter')
    }
  }
})

/**
 * Creates a new iter from the given indexable object.
 * @param source The source of the iter.
 * @param start The start index of the iter.
 * @param end The end index of the iter.
 * @param step The step of the iter for decrementing or incrementing.
 * @returns The new iter.
 */
export function iter<T>(source: ArrayLike<T>, start?: number, end?: number, step?: number): Iter<T>;

/**
 * Creates a new iter from the given iter.
 * @param iter The iter to create a new iter from. The reference of the {@link Iter.source} of the new iter will be the same as the given iter.
 * @returns The new iter.
 */
export function iter<T>(iter: Iter<T>): Iter<T>;
export function iter<T>(source: ArrayLike<T> | Iter<T>, start?: number, end?: number, step?: number): Iter<T> {
  return new Iter<T>(source, start, end, step);
}
