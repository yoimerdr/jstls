import {readonlys} from "@jstls/core/definer/values";
import {first, firstOrNull, isEmpty, isNotEmpty, last, lastOrNull} from "@jstls/core/extensions/shared/iterables";
import {ArrayExtensions} from "@jstls/types/core/extensions/array";
import {counts, extend, filterDefined, remove} from "./fn";

export {counts, extend, filterDefined, remove} from "./fn";


/**
 * Apply to the Array prototype the given extensions.
 * @param extensions The extensions to apply.
 * @see {ArrayExtensions}
 */
export function arrayExtensions(extensions: Partial<ArrayExtensions<any>>) {
  readonlys(<any>Array.prototype, extensions)
}

/**
 * Apply to the Array prototype some utils extensions.
 * @see {ArrayExtensions}
 */
export function applyArrayExtensions() {
  readonlys(<any>Array.prototype, {
    first,
    firstOrNull,
    isEmpty,
    isNotEmpty,
    last,
    lastOrNull,
    counts,
    extends: extend,
    filterDefined,
    remove
  })
}
