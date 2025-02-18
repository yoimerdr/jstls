import {configurables} from "../../definer";
import {apply} from "../../functions/apply";
import {string} from "../../objects/handlers";
import {create} from "../../shortcuts/object";
import {random} from "../../shortcuts/math";
import {concat} from "../../shortcuts/string";

let id = 0;
const postfix = random();

export function uid(key: string): string {
  return concat("Symbol('", string(key), "')_", apply(1.0.toString, ++id + postfix, [36]));
}

export type SymbolLike = {
  readonly description: string;
} & Object

export function Symbol(description: any ): SymbolLike {
  if (new.target !== undefined)
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
