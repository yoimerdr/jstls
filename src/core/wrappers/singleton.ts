import {configurable} from "@/core/definer";
import {FunctionType, Instanceable, InstanceableParameters, InstanceableType, WithConstructor} from "@/types/core";
import {IllegalAccessError} from "@/core/exceptions/illegal-access";
import {isFunction} from "@/core/objects/types";
import {is} from "@/core/polyfills/objects/es2015";
import {uid} from "@/core/polyfills/symbol";
import {slice} from "@/core/iterable";
import {apply} from "@/core/functions/apply";
import {hasOwn} from "@/core/polyfills/objects/es2022";
import {SingletonInit} from "@/types/core/wrappers/singleton";
import {get, get2} from "@/core/objects/handlers/getset";
import {funclass2} from "@/core/definer/classes/funclass";
import {returns} from "@/core/utils/fn";
import {nullable} from "@/core/utils/types";
import {KeyableObject, PrototypeType, WithPrototype} from "@/types/core/objects";
import {concat} from "@/core/shortcuts/indexable";
import {deletes2} from "@/core/objects/handlers/deletes";

const singletonSymbol = uid('mI');

function checkSingleton(target: Object, init?: SingletonInit<any>) {
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

export interface Singleton<S extends Singleton<S>> {

}

export interface SingletonConstructor<T extends Singleton<T> = any> extends WithPrototype<T> {
  new<S extends Singleton<S>>(init?: SingletonInit<S>): Singleton<S>;

  getInstance<T extends Instanceable>(this: T, ...args: InstanceableParameters<T>): InstanceableType<T>;

  getInstance<S extends Singleton<S>>(this: Instanceable<S>,): S;

  hasInstance(): boolean;
}

/**
 * The singleton class. Classes that inherit from it can have a single instance.
 *
 * @example
 * class A extends Singleton<A> {
 *   constructor(...args) {
 *     return super((instance) => {
 *       // init instance properties
 *     })
 *   }
 * }
 *
 * const a = new A();
 * const b = new A();
 *
 * console.log(a === b) // true
 */
export const Singleton: SingletonConstructor = funclass2({
  construct: function (init) {
    const $this = this;
    if (is($this.constructor, Singleton))
      throw new IllegalAccessError('[Singleton] The Singleton class not allowed to be instantiated. Is only allowed to be extended.');
    return checkSingleton($this, init)
  },
  statics: {
    getInstance() {
      const $this = this;
      if (!get($this, singletonSymbol))
        configurable($this, singletonSymbol, new (apply($this.bind, $this, concat([<any>nullable], slice(arguments))))());
      return get($this, singletonSymbol);
    },
    hasInstance() {
      return hasOwn(this, singletonSymbol);
    }
  }
})
