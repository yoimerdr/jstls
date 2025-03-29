import {Iter, iterEachOrFindIndex, iterMap} from "./iter";
import {IterMap, IterMatchCondition} from "../../types/core/iterable";
import {Maybe} from "../../types/core";
import {apply} from "../functions/apply";
import {WithPrototype} from "../../types/core/objects";
import {ArrayLike} from "../../types/core/array";
import {funclass} from "../definer/classes";
import {FunctionClassSimpleStatics} from "../../types/core/definer";

export interface IterMatch<T> extends Iter<T> {
  /**
   * Returns the first element that satisfies the condition.
   * @param condition The condition to satisfy.
   * @returns The first element or undefined.
   */
  first(condition: IterMatchCondition<T>): Maybe<T>

  /**
   * Returns the index of the first element that satisfies the condition.
   * @param condition The condition to satisfy.
   * @returns The index of the first element or -1.
   */
  firstIndex(condition: IterMatchCondition<T>): number

  /**
   * Returns the last element that satisfies the condition.
   * @param condition The condition to satisfy.
   * @returns The last element or undefined.
   */
  last(condition: IterMatchCondition<T>): Maybe<T>

  /**
   * Returns the index of the last element that satisfies the condition.
   * @param condition The condition to satisfy.
   * @returns The index of the last element or -1.
   */
  lastIndex(condition: IterMatchCondition<T>): number

  /**
   * Returns a new iter that contains elements that satisfy the condition.
   * @param condition The condition to satisfy.
   * @returns The new iter.
   */
  where(condition: IterMatchCondition<T>): IterMatch<T>

  /**
   * Returns a new iter that contains elements (in reverse order) that satisfy the condition.
   * @param condition The condition to satisfy.
   * @returns The new iter.
   */
  rwhere(condition: IterMatchCondition<T>): IterMatch<T>

  map<A, R>(fn: IterMap<T, A, R>, thisArg?: R): IterMatch<A>;

  rmap<A, R>(fn: IterMap<T, A, R>, thisArg?: R): IterMatch<A>
}


export interface IterMatchConstructor extends WithPrototype<IterMatch<any>> {
  new<T>(source: ArrayLike<T> | Iter<T>, start?: number, end?: number, step?: number): IterMatch<T>;
}

/**
 * The iter class for iterating over a indexable object.
 * @class
 */
export const IterMatch: IterMatchConstructor = funclass({
  prototype: <FunctionClassSimpleStatics<IterMatch<unknown>>>{
    first(condition) {
      const $this = this
      return $this.at($this.firstIndex(condition));
    },
    firstIndex(condition) {
      const $this = this
      return apply(iterEachOrFindIndex, $this, [
        $this.start, $this.isInBounds, undefined!,
        $this.next, undefined, false, condition
      ]);
    },
    last(condition) {
      const $this = this
      return $this.at($this.lastIndex(condition));
    },
    lastIndex(condition) {
      const $this = this
      return apply(iterEachOrFindIndex, $this, [
        $this.end, $this.isInBounds, undefined!,
        $this.previous, undefined, false, condition
      ]);
    },
    where(condition) {
      const $this = this
      return apply(iterMap, $this, [
        IterMatch, $this.each, undefined,
        undefined, condition
      ]);
    },
    rwhere(condition) {
      const $this = this
      return apply(iterMap, $this, [
        IterMatch, $this.reach, undefined,
        undefined, condition
      ]);
    },
    map(fn, thisArg) {
      const $this = this
      return apply(iterMap, $this, [
        IterMatch, $this.each,
        fn, thisArg
      ]);
    },
    rmap(fn, thisArg) {
      const $this = this
      return apply(iterMap, $this, [
        IterMatch, $this.reach,
        fn, thisArg
      ]);
    }
  }
})


/**
 * Creates a new iter match from the given iter.
 * @param iter The iter to create a new iter match from. The reference of the {@link Iter.source} of the new iter match will be the same as the given iter.
 * @returns The new iter match.
 */
export function match<T>(iter: Iter<T>): IterMatch<T>;

/**
 * Creates a new iter match from the given indexable object.
 * @param source The source of the iter match.
 * @param start The start index of the iter match.
 * @param end The end index of the iter match.
 * @param step The step of the iter match for decrementing or incrementing.
 * @returns The new iter match.
 */
export function match<T>(source: ArrayLike<T>, start?: number, end?: number, step?: number): IterMatch<T>;
export function match<T>(source: ArrayLike<T> | Iter<T>, start?: number, end?: number, step?: number): IterMatch<T> {
  return new IterMatch(source, start, end, step)
}
