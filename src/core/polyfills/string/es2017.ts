import {string} from "../../objects/handlers";
import {repeat} from "./es2015";
import {apply} from "../../functions/apply";
import {len} from "../../shortcuts/indexable";
import {returns} from "../../utils/fn";

function padString(this: string, length: number, fill?: string, start?: boolean): string {
  fill = string(fill, returns(" "));
  length = length >> 0;
  const $this = this;
  if(len($this) >= length)
    return $this;
  length -= len($this);
  if(length > len(fill))
    fill += apply(repeat, fill, [length / len(fill)]);
  fill = fill.slice(0, length)
  return start ? fill + $this : $this + fill;
}

export function padStart(this: string, length: number, fill?: string): string {
  return apply(padString, this, [length, fill, true]);
}

export function padEnd(this: string, length: number, fill?: string): string {
  return apply(padString, this, [length, fill]);
}


