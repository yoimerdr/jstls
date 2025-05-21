import {configurables} from "@jstls/core/definer";
import {apply} from "@jstls/core/functions/apply";
import {string} from "@jstls/core/objects/handlers";
import {create} from "@jstls/core/shortcuts/object";
import {random} from "@jstls/core/shortcuts/math";
import {concat} from "@jstls/core/shortcuts/string";
import {indefinite} from "@jstls/core/utils/types";

let id = 0;
const postfix = random();

export function uid(key: string): string {
  return concat("Symbol('", string(key), "')_", apply(1.0.toString, ++id + postfix, [36]));
}

export type SymbolLike = {
  readonly description: string;
} & Object

export function Symbol(description: any ): SymbolLike {
  if (new.target !== indefinite)
    throw new TypeError("Symbol is not a constructor");
  else if(description instanceof Symbol)
    throw new TypeError("Cannot convert symbol to a string.");
  const symbol = create(Symbol.prototype);
  const tag = uid(description);
  configurables(symbol, {
    description,
    toString() {
      return tag;
    }
  })

  return symbol;
}
