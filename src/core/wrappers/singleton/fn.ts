import {uid} from "@jstls/core/polyfills/symbol";
import {SingletonInit} from "@jstls/types/core/wrappers/singleton";
import {apply} from "@jstls/core/functions/apply";
import {configurable} from "@jstls/core/definer";
import {hasOwn} from "@jstls/core/polyfills/objects/es2022";
import {KeyableObject, PrototypeType, WithPrototype} from "@jstls/types/core/objects";
import {FunctionType, Instanceable, WithConstructor} from "@jstls/types/core";
import {get2} from "@jstls/core/objects/handlers/getset";
import {deletes2} from "@jstls/core/objects/handlers/deletes";
import {isFunction} from "@jstls/core/objects/types";
import {funclass2} from "@jstls/core/definer/classes/funclass";
import {returns} from "@jstls/core/utils";
import {slice} from "@jstls/core/iterable";

const singletonSymbol = uid('mI');

export function checkSingleton(target: Object, init?: SingletonInit<any>) {
  const instance = getInstance(target);
  if (instance)
    return instance;
  init && apply(init!, target, [target]);
  configurable(target.constructor, singletonSymbol, target);
  return target;
}

export function hasInstance(target: Object): boolean {
  return hasOwn(target.constructor, singletonSymbol);
}

export function getInstance<T extends (WithPrototype & WithConstructor)>(target: T): PrototypeType<T>;
export function getInstance<T extends WithConstructor>(target: T): KeyableObject;
export function getInstance<T extends (WithPrototype & WithConstructor)>(target: T): PrototypeType<T> {
  return get2(target.constructor, singletonSymbol);
}

export function removeInstance(target: Object): boolean {
  const has = hasInstance(target);
  has && deletes2(target, [singletonSymbol])
  return has;
}

/**
 * The singleton decorator. Classes using this decorator will have a single instance.
 *
 * @example
 * // typescript code
 * '@singleton' // It's @singleton, without quotation marks
 * class A {
 *   constructor(...args: any[]) {
 *     // init
 *   }
 * }
 *
 * const a = new A();
 * const b = new A();
 *
 * console.log(a === b) // true
 */
export function singleton<T extends Instanceable>(target: T, context: ClassDecoratorContext): T;
/**
 * Creates on the instance class a unique field for the unique instance.
 * @example
 * class A {
 *   constructor(...args) {
 *     return singleton(this, (instance) => {
 *       // init fields
 *     })
 *   }
 * }
 *
 * const a = new A();
 * const b = new A();
 *
 * console.log(a === b) // true
 * @param target The target instance. Must be a class instance or an object with the `constructor` field shared among all its instances.
 * @param init The init for the target instance.
 */
export function singleton<T extends Object>(target: T, init: SingletonInit<T>): T;
export function singleton<T extends Instanceable>(target: T, context: any) {
  if (isFunction(context))
    return checkSingleton(target, context);

  return funclass2({
    cls: returns<FunctionType<any>>(function () {
      return checkSingleton(this, function ($this) {
        apply(target as Instanceable, $this, slice(arguments))
      });
    })
  }, target);
}
