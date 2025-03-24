import {KeyableObject, WithPrototype} from "../../types/core/objects";
import {get, set, setTo} from "../objects/handlers/getset";
import {isFunction} from "../objects/types";
import {concat} from "../shortcuts/string";
import {propertyNames} from "../objects/handlers/properties";

export function statics<T extends WithPrototype>(target: T, base: WithPrototype): T {
  (
    get(Object, 'setPrototypeOf') ||
    ({__proto__: []} instanceof Array && function (target: KeyableObject, base: KeyableObject) {
      set(target, "__proto__", base);
    }) ||
    ((target: T, base: WithPrototype) => setTo(base, propertyNames(base), target))
  )(target, base);

  return target;
}

export function prototype<T extends WithPrototype>(target: T, base: WithPrototype): T;
export function prototype(target: CallableFunction, base: WithPrototype): WithPrototype {
  if (!isFunction(base) && base !== null)
    throw new TypeError(concat("Class extends value ", base, " is not a constructor or null"));

  statics(target, base);

  function __(this: any) {
    this.constructor = base;
  }

  try {
    // safe assign for readonly prototypes
    (target as KeyableObject).prototype = base === null ? Object.create(base) : (__.prototype = base.prototype, new (__ as any)());
  } catch (e) {
    const proto = base && base.prototype;
    base && setTo(proto, propertyNames(proto), target.prototype)
  }

  return target;
}
