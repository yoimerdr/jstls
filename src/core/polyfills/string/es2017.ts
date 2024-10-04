import {string} from "../../objects/handlers";
import {repeat} from "./es2015";
import {apply} from "../../functions/apply";

function padString(this: string, length: number, fill?: string, start?: boolean): string {
  fill = string(fill, () => " ");
  length = length >> 0;
  if(this.length >= length)
    return this;
  length -= this.length;
  if(length > fill.length)
    fill += apply(repeat, fill, [length / fill.length]);
  fill = fill.slice(0, length)
  return start ? fill + this : this + fill;
}

export function padStart(this: string, length: number, fill?: string): string {
  return apply(padString, this, [length, fill, true]);
}

export function padEnd(this: string, length: number, fill?: string): string {
  return apply(padString, this, [length, fill]);
}


