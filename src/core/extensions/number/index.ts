import {readonlys} from "@jstls/core/definer";
import {NumberExtensions} from "@jstls/types/core/extensions/number";
import {coerceAtLeast, coerceAtMost, isFromTo, isFromUntil} from "./simple";
import {coerceIn} from "./required";

export {coerceAtLeast, coerceAtMost, isFromTo, isFromUntil} from "./simple";
export {coerceIn} from "./required";

/**
 * Apply to the Number prototype the given extensions.
 * @param extensions The extensions to apply.
 * @see {NumberExtensions}
 */
export function numberExtensions(extensions: Partial<NumberExtensions>) {
  readonlys(<any>Number.prototype, extensions);
}

/**
 * Apply to the Number prototype some utils extensions.
 * @see {NumberExtensions}
 */
export function applyNumberExtensions() {
  readonlys(<any>Number.prototype, {
    coerceAtLeast,
    coerceAtMost,
    coerceIn,
    isFromTo,
    isFromUntil
  })
}
