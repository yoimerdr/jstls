import {Iter} from "./iter";
import {WithPrototype} from "@jstls/types/core/objects";
import {funclass2} from "@jstls/core/definer/classes/funclass";
import {FunctionClassSimpleStatics} from "@jstls/types/core/definer";
import {protocall} from "@jstls/core/functions/prototype/call";
import {indefinite} from "@jstls/core/utils/types";
import {isinstance} from "@jstls/core/objects/types";
import {apply} from "@jstls/core/functions/apply";

export interface IterRange extends Iter<number> {
}

export interface IterRangeConstructor extends WithPrototype<IterRange> {
  new(length: number | Iter<any>, start?: number, step?: number): IterRange;
}

export const IterRange: IterRangeConstructor = funclass2({
  cls: (_, parent) => function (length, start, step) {
    if (isinstance(length, Iter)) {
      start = (length as Iter<any>).startIndex;
      step = (length as Iter<any>).step;
      length = (length as Iter<any>).length();
    }
    apply(parent, this, [{length}, start, indefinite, step] as any);
  },
  prototype: <FunctionClassSimpleStatics<IterRange>>{
    next() {
      const $this = this;
      protocall(Iter, "next", $this);
      const index = $this.index();
      return index > $this.endIndex ? indefinite! : index;
    },
    previous() {
      const $this = this;
      protocall(Iter, "previous", $this);
      const index = $this.index();
      return index < $this.startIndex ? indefinite! : index;
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

