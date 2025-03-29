import {Iter} from "./iter";
import {WithPrototype} from "../../types/core/objects";
import {funclass} from "../definer/classes";
import {call} from "../functions/call";
import {FunctionClassSimpleStatics} from "../../types/core/definer";
import {protocall} from "../functions/prototype";

export interface IterRange extends Iter<number> {
}

export interface IterRangeConstructor extends WithPrototype<IterRange> {
  new(length: number | Iter<any>, start?: number, step?: number): IterRange;
}

export const IterRange: IterRangeConstructor = funclass({
  cls: (_, parent) => function (length, start, step) {
    if (length instanceof Iter) {
      start = length.startIndex;
      step = length.step;
      length = length.length();
    }
    call(parent, this, {length}, start, undefined, step);
  },
  prototype: <FunctionClassSimpleStatics<IterRange>>{
    next() {
      const $this = this;
      protocall(Iter, "next", this);
      const index = $this.index();
      return index > $this.endIndex ? undefined! : index;
    },
    previous() {
      const $this = this;
      protocall(Iter, "previous", $this);
      const index = $this.index();
      return index < $this.startIndex ? undefined! : index;
    },
    at(index) {
      const $this = this;
      protocall(Iter, "at", $this, index);
      return $this.index();
    }
  }
}, Iter);

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

