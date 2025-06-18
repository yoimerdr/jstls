import {ArrayLike} from "@jstls/types/core/array";
import {protoapply} from "@jstls/core/functions/prototype/apply";

export function slice<T extends any>(source: ArrayLike<T>, startIndex?: number, endIndex?: number): T[] {
  return protoapply(Array<any>, "slice", source, [startIndex, endIndex]);
}
