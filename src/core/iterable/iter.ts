import {readonlys, writeable} from "../definer";
import {coerceAtLeast, coerceAtMost, coerceIn, isFromTo} from "../extensions/number";
import {isEmpty} from "../extensions/shared/iterables";
import {WithLength} from "../../types/core/objects";
import {IterEach, IterEachNext, IterEachPrevious, IterMap, IterMatchCondition} from "../../types/core/iterable";
import {Instanceable} from "../../types/core";
import {getDefined} from "../objects/validators";
import {IllegalAccessError} from "../exceptions";
import {ArrayLike} from "../../types/core/array";
import {apply} from "../functions/apply";
import {uid} from "../polyfills/symbol";
import {get, set} from "../objects/handlers/getset";
import {freeze} from "../shortcuts/object";
import {len} from "../shortcuts/indexable";

export function iterEachOrFindIndex<T, R>(this: Iter<T>,
                                          restartFn: (this: Iter<T>) => any,
                                          whileFn: (this: Iter<T>) => boolean,
                                          eachFn: IterEach<T, R> | IterEachNext<T, R>,
                                          advanceFn: (this: Iter<T>) => T,
                                          thisArg?: R,
                                          includeAdvance?: boolean,
                                          matchFn?: IterMatchCondition<T>): number {
  const startIndex = this.index();
  apply(restartFn, this);
  while (apply(whileFn, this)) {
    const index = this.index();
    const current = this.current();
    const advance = apply(advanceFn, this);
    if (matchFn && matchFn(current, index))
      return index;
    else if (eachFn)
      apply(<any>eachFn, thisArg, includeAdvance ? [current, advance, index] : [current, index])
  }

  if (startIndex !== this.index())
    this.at(startIndex);
  return -1;
}

export function iterMap<T, R, A, I extends Iter<A>>(this: Iter<T>,
                                                    constructor: Instanceable<I, [value: ArrayLike<any>]>,
                                                    iterate: ((this: Iter<T>, fn: IterEach<T, R>, thisArg?: R) => void),
                                                    fn?: IterMap<T, A, R>,
                                                    thisArg?: R,
                                                    condition?: IterMatchCondition<T>,): I {
  const indexable = <ArrayLike<A>>{};
  let index = 0;
  apply(iterate, this, [
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


export function iterRepresentation(this: Iter<any>, name: string): string {
  return `[${this.length()}] ${name} { start: ${this.startIndex}, end: ${this.endIndex}, current: ${this.index()} }`
}


export const iterIndex = uid("Iter#index")

/**
 * The iter class for iterating over a indexable object.
 * @class
 */
export class Iter<T> {
  /**
   * The end index of the iter.
   */
  readonly endIndex!: number;

  /**
   * The start index of the iter.
   */
  readonly startIndex!: number;

  /**
   * The step of the iter.
   */
  readonly step!: number;

  /**
   * The source of the iter.
   */
  readonly source!: ArrayLike<T>;


  constructor(source: ArrayLike<T> | Iter<T>, start?: number, end?: number, step?: number) {
    if (source instanceof Iter) {
      start = source.startIndex;
      end = source.endIndex;
      step = source.step;
      source = source.source;
    } else if (len(source) > 0) {
      step = apply(coerceAtLeast, getDefined(step, () => 0), [1]);
      if (step > len(source))
        throw new IllegalAccessError("The step cannot be greater than the source length");
      start = apply(coerceAtMost, getDefined(start, () => 0), [len(source) - step]);
      end = apply(coerceIn, getDefined(end, () => len((<WithLength>source))), [start, len(source) - step]);
    } else {
      start = end = 0;
      step = 1;
    }

    readonlys(this as Iter<T>, {
      startIndex: start,
      endIndex: end,
      step,
      source
    })

    writeable(this as Iter<T>, iterIndex, start);
  }

  /**
   * Gets the current index of the iter.
   */
  index(): number {
    return get(this, iterIndex);
  }

  /**
   * Gets the length of the iter source.
   * @see {@link source}
   */
  length(): number {
    return len(this.source);
  }

  /**
   * Gets the value of the iter at the current index.
   * @see {index}
   * @see {at}
   */
  current(): T {
    return this.isOutBounds() ? undefined! : this.at(this.index())
  }

  /**
   * Gets the value of the iter at the given index.
   * @param index The index to get the value at.
   * @returns The value at the given index.
   */
  at(index: number): T {
    if (index < 0)
      index += this.endIndex + 1;
    const target = apply(coerceIn, index, [this.startIndex, this.endIndex]);
    if (target !== index)
      return undefined!;

    set(this, iterIndex, target);
    return this.source[target];
  }

  /**
   * Gets the previous value of the iter.
   * @returns The previous value of the iter.
   */
  previous(): T {
    set(this, iterIndex, apply(coerceAtLeast, this.index() - this.step, [this.startIndex - this.step]));
    return this.source[this.index()];
  }

  /**
   * Checks if the iter has a previous value.
   * @returns true if the iter has a previous value, false otherwise.
   */
  hasPrevious(): boolean {
    return this.index() - this.step >= this.startIndex;
  }

  /**
   * Gets the next value of the iter.
   * @returns The next value of the iter.
   */
  next(): T {
    set(this, iterIndex, apply(coerceAtMost, this.index() + this.step, [this.endIndex + this.step]));
    return this.source[this.index()];
  }

  /**
   * Checks if the iter has a next value.
   * @returns true if the iter has a next value, false otherwise.
   */
  hasNext(): boolean {
    return this.index() + this.step <= this.endIndex;
  }

  /**
   * Gets the start value of the iter.
   * @returns The start value of the iter.
   */
  start(): T {
    return this.at(this.startIndex)
  }


  /**
   * Performs the given function for each value of the iter, starting from the {@link startIndex}.
   * @param fn The function to perform for each value.
   * @param thisArg The context of the function.
   * @returns The iter.
   */
  each<R>(fn: IterEach<T, R>, thisArg?: R): this {
    apply(iterEachOrFindIndex, this, [this.start, this.isInBounds, <any>fn, this.next, thisArg]);
    return this;
  }

  /**
   * Performs the given function for each value of the iter, starting from the {@link endIndex}.
   * @param fn The function to perform for each value.
   * @param thisArg The context of the function.
   * @returns The iter.
   */
  reach<R>(fn: IterEach<T, R>, thisArg?: R): this {
    apply(iterEachOrFindIndex, this, [this.end, this.isInBounds, <any>fn, this.previous, thisArg]);
    return this;
  }

  /**
   * Performs the given function for each value of the iter, starting from the {@link startIndex}, and returns a new iter with the results.
   * @param fn The function to perform for each value.
   * @param thisArg The context of the function.
   * @returns The new iter.
   */
  map<A, R>(fn: IterMap<T, A, R>, thisArg?: R): Iter<A> {
    return apply(iterMap, this, [Iter, this.each, <any>fn, thisArg]) as Iter<A>;
  }

  /**
   * Performs the given function for each value of the iter, starting from the {@link endIndex}, and returns a new iter with the results.
   * @param fn The function to perform for each value.
   * @param thisArg The context of the function.
   * @returns The new iter.
   */
  rmap<A, R>(fn: IterMap<T, A, R>, thisArg?: R): Iter<A> {
    return apply(iterMap, this, [Iter, this.reach, <any>fn, thisArg]) as Iter<A>;
  }


  /**
   * Performs the given function for each and next value of the iter, starting from the {@link startIndex}.
   * @param fn The function to perform for each and next value.
   * @param thisArg The context of the function.
   * @returns The iter.
   */
  eachnxt<R>(fn: IterEachNext<T, R>, thisArg?: R): this {
    apply(iterEachOrFindIndex, this, [this.start, this.hasNext, <any>fn, this.next, thisArg, true]);
    return this;
  }

  /**
   * Performs the given function for each and previous value of the iter, starting from the {@link endIndex}.
   * @param fn The function to perform for each and previous value.
   * @param thisArg The context of the function.
   * @returns The iter.
   */
  eachprv<R>(fn: IterEachPrevious<T, R>, thisArg?: R): this {
    apply(iterEachOrFindIndex, this, [this.end, this.hasPrevious, <any>fn, this.previous, thisArg, true]);
    return this;
  }

  /**
   * Gets the end value of the iter.
   * @returns The end value of the iter.
   */
  end(): T {
    return this.at(this.endIndex)
  }

  /**
   * Checks if the iter is out of bounds.
   * @returns true if the iter is out of bounds, false otherwise.
   */
  isOutBounds(): boolean {
    return this.isEmpty() || !apply(isFromTo, this.index(), [this.startIndex, this.endIndex]);
  }

  /**
   * Checks if the iter is in bounds.
   * @returns true if the iter is in bounds, false otherwise.
   */
  isInBounds(): boolean {
    return !this.isOutBounds()
  }

  /**
   * Checks if the iter is empty.
   * @returns true if the iter is empty, false otherwise.
   */
  isEmpty(): boolean {
    return apply(isEmpty, this.source);
  }

  /**
   * Checks if the iter is not empty.
   * @returns true if the iter is not empty, false otherwise.
   */
  isNotEmpty(): boolean {
    return !this.isEmpty();
  }

  /**
   * Executes the given function if the iter is not empty.
   * @param fn The function to execute if the iter is not empty.
   * @param thisArg The context of the function.
   * @returns The iter.
   */
  ifNotEmpty<R>(fn: (this: R, iter: this) => void, thisArg?: R): this {
    if (this.isNotEmpty())
      apply(fn, thisArg!, [this]);
    return this;
  }

  /**
   * Converts the iter to an array.
   * @returns The array.
   */
  toArray(): T[] {
    const result: T[] = [];
    this.each(it => result.push(it));
    return result;
  }

  toString(): string {
    return apply(iterRepresentation, this, ['Iter'])
  }
}

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
