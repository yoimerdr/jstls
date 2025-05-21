import {readonlys} from "@jstls/core/definer";
import {StringExtensions} from "@jstls/types/core/extensions/string";
import {MaybeNumber} from "@jstls/types/core";
import {isEmpty, isNotEmpty} from "./shared/iterables";
import {getDefined} from "@jstls/core/objects/validators";
import {returns} from "@jstls/core/utils/fn";
import {nullable} from "@jstls/core/utils/types";


export function toInt(this: string | number, radix?: number): MaybeNumber;
export function toInt(radix: MaybeNumber, $this: string | number): MaybeNumber;
export function toInt(this: string | number, radix?: MaybeNumber, $this?: string | number): MaybeNumber {
  const value = parseInt(<string>(getDefined(this, returns($this!))), radix!);
  return isNaN(value) ? nullable : value
}

export function toFloat(this: string | number): MaybeNumber;
export function toFloat($this: string | number): MaybeNumber;
export function toFloat(this: string | number, $this?: string | number): MaybeNumber {
  const value = parseFloat(<string>(getDefined(this, returns($this!))));
  return isNaN(value) ? nullable : value
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
