import {string} from "../../objects/handlers";
import {configurables} from "../../definer";
import {apply} from "../../functions/apply";

let id = 0;
const postfix = Math.random();

export function uid(key: string): string {
  return `Symbol('${string(key)}')_${apply(1.0.toString, ++id + postfix, [36])}`;
}

export type SymbolLike = {
  readonly description: string;
} & Object

export function Symbol(description: any ): SymbolLike {
  if (new.target !== undefined)
    throw new TypeError("Symbol is not a constructor");
  else if(description instanceof Symbol)
    throw new TypeError("Cannot convert symbol to a string.");
  const symbol = Object.create(Symbol.prototype);
  const tag = uid(description);
  configurables(symbol, {
    description,
    toString() {
      return tag;
    }
  })

  return symbol;

}
