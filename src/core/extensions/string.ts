import {readonlys} from "../definer";
import {StringExtensions} from "../../types/core/extensions/string";
import {MaybeNumber} from "../../types/core";
import {isEmpty, isNotEmpty} from "./shared/iterables";
import {getDefined} from "../objects/validators";
import {returns} from "../utils";


export function toInt(this: string | number, radix?: number): MaybeNumber;
export function toInt(radix: MaybeNumber, $this: string | number): MaybeNumber;
export function toInt(this: string | number, radix?: MaybeNumber, $this?: string | number): MaybeNumber {
  const value = parseInt(<string>(getDefined(this, returns($this!))), radix!);
  return isNaN(value) ? null : value
}

export function toFloat(this: string | number): MaybeNumber;
export function toFloat($this: string | number): MaybeNumber;
export function toFloat(this: string | number, $this?: string | number): MaybeNumber {
  const value = parseFloat(<string>(getDefined(this, returns($this!))));
  return isNaN(value) ? null : value
}

/**
 * Apply to the String prototype some utils extensions.
 * @see {StringExtensions}
 */
export function applyStringExtensions() {
  readonlys(<any>String.prototype, {
    isEmpty,
    isNotEmpty,
    toInt,
    toFloat
  })
}

/**
 * Apply to the String prototype the given extensions.
 * @param extensions The extensions to apply.
 * @see {StringExtensions}
 */
export function stringExtensions(extensions: Partial<StringExtensions>) {
  readonlys(<any>String.prototype, extensions);
}
