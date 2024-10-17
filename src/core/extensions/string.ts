import {readonlys} from "../definer";
import {StringExtensions, StringWithExtensions} from "../../types/core/extensions/string";
import {MaybeNumber} from "../../types/core";
import {isEmpty, isNotEmpty} from "./shared/iterables";


export function toInt(this: string | number | StringExtensions, radix?: number): MaybeNumber {
  const value = parseInt(<string> this, radix);
  return isNaN(value) ? null : value
}

export function toFloat(this: string | number | StringExtensions): MaybeNumber {
  const value = parseFloat(<string> this);
  return isNaN(value) ? null : value
}

/**
 * Apply to the String prototype some utils extensions.
 * @see {StringExtensions}
 */
export function applyStringExtensions() {
  readonlys(<StringWithExtensions>String.prototype,{
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
  readonlys(String.prototype, extensions);
}
