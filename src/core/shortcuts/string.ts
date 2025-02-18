import {apply} from "../functions/apply";
import {slice} from "../iterable";

export function concat(base: string, ...others: Object[]): string {
  return apply(base.concat, base, slice(arguments, 1));
}
