import {KeyableObject, WithPrototype} from "@jstls/types/core/objects";
import {get2, set2, setTo} from "@jstls/core/objects/handlers/getset";
import {isFunction} from "@jstls/core/objects/types";
import {concat} from "@jstls/core/shortcuts/string";
import {propertyNames} from "@jstls/core/shortcuts/object";
import {nullable} from "@jstls/core/utils/types";

export function statics<T extends WithPrototype>(target: T, base: WithPrototype): T {
  (
    get2(Object, 'setPrototypeOf') ||
    ({__proto__: []} instanceof Array && function (target: KeyableObject, base: KeyableObject) {
      set2(target, "__proto__", base);
    }) ||
    ((target: T, base: WithPrototype) => setTo(base, propertyNames(base), target))
  )(target, base);

  return target;
}

export function prototype<T extends WithPrototype>(target: T, base: WithPrototype): T;
export function prototype(target: CallableFunction, base: WithPrototype): WithPrototype {
  if (!isFunction(base) && base !== nullable)
    throw new TypeError(concat("Class extends value ", base, " is not a constructor or null"));

  statics(target, base);

  function __(this: any) {
    this.constructor = base;
  }

  try {
    // safe assign for readonly prototypes
    (target as KeyableObject).prototype = base === nullable ? Object.create(base) : (__.prototype = base.prototype, new (__ as any)());
  } catch (e) {
    const proto = base && base.prototype;
    base && setTo(proto, propertyNames(proto), target.prototype)
  }

  return target;
}
