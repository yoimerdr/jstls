import {string} from "@jstls/core/objects/handlers";
import {repeat} from "./es2015";
import {apply} from "@jstls/core/functions/apply";
import {len} from "@jstls/core/shortcuts/indexable";
import {returns} from "@jstls/core/utils";
import {partial} from "@jstls/core/functions/partial";

export interface PadString {
  (this: string, length: number, fill?: string): string;
}

function padString(this: string, start: boolean, length: number, fill?: string): string {
  fill = string(fill, returns(" "));
  length = length >> 0;
  const $this = this;
  if (len($this) >= length)
    return $this;
  length -= len($this);
  if (length > len(fill))
    fill += apply(repeat, fill, [length / len(fill)]);
  fill = fill.slice(0, length)
  return start ? fill + $this : $this + fill;
}

export const padStart = partial(padString, true) as PadString,
  padEnd = partial(padString, false) as PadString;


