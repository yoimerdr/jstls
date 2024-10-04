import {Iter} from "./iter";
import {coerceIn} from "../extensions/number";
import {apply} from "../functions/apply";

/**
 * The iter class for iterating over a range.
 * @class
 */
export class IterRange extends Iter<number> {
  constructor(length: number | Iter<any>, start?: number, step?: number) {
    if (length instanceof Iter) {
      start = length.startIndex;
      step = length.step;
      length = length.length();
    }
    super({
      length,
    }, start, undefined, step);
  }

  at(index: number): number {
    if (index < 0)
      index += this.endIndex + 1;
    const current = apply(coerceIn, index, [this.startIndex, this.endIndex]);
    this._index = current;
    return current !== index ? undefined! : current;
  }

  next(): number {
    super.next();
    return this.index() > this.endIndex ? undefined! : this.index();
  }

  previous(): number {
    super.previous();
    return this.index() < this.startIndex ? undefined! : this.index();
  }
}

/**
 * Creates a new iter range from the given length.
 * @param length The iter to create a new iter from.
 * @returns The new iter range.
 */
export function range(length: Iter<any>): IterRange;

/**
 * Creates a new iter range from the given length.
 * @param length The length of the iter range.
 * @param start The start index of the iter range.
 * @param step The step of the iter range.
 *
 * @example
 * // the iter range
 * range(10, 1, 2)
 *  .each(it => console.log(it));
 *
 * // is equivalent to
 * for (let i = 1; i < 10; i+=2) {
 *   console.log(i);
 * }
 *
 * @returns The new iter range.
 */
export function range(length: number | Iter<any>, start?: number, step?: number): IterRange;
export function range(length: number | Iter<any>, start?: number, step?: number): IterRange {
  return new IterRange(length, start, step);
}

