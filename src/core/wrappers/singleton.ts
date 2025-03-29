import {readonly} from "../definer";
import {FunctionType, Instanceable, InstanceableParameters, InstanceableType} from "../../types/core";
import {IllegalAccessError} from "../exceptions";
import {isFunction} from "../objects/types";
import {is} from "../polyfills/objects/es2015";
import {uid} from "../polyfills/symbol";
import {slice} from "../iterable";
import {apply} from "../functions/apply";
import {hasOwn} from "../polyfills/objects/es2022";
import {SingletonInit} from "../../types/core/wrappers/singleton";
import {get} from "../objects/handlers/getset";
import {funclass} from "../definer/classes";
import {returns} from "../utils";
import {WithPrototype} from "../../types/core/objects";
import {concat} from "../shortcuts/indexable";

const singletonSymbol = uid('mI');

function checkSingleton(target: Object, init?: SingletonInit<any>) {
  const instance = get(target.constructor, singletonSymbol);
  if (instance)
    return instance;
  init && apply(init!, target, [target]);
  readonly(target.constructor, singletonSymbol, target);
  return target;
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

  return funclass({
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
export const Singleton: SingletonConstructor = funclass({
  construct(init) {
    if (is(this.constructor, Singleton))
      throw new IllegalAccessError('[Singleton] The Singleton class not allowed to be instantiated. Is only allowed to be extended.');
    return checkSingleton(this, init)
  },
  statics: {
    getInstance() {
      const $this = this;
      if (!get($this, singletonSymbol))
        readonly($this, singletonSymbol, new (apply($this.bind, $this, concat([<any>null], slice(arguments))))());
      return get($this, singletonSymbol);
    },
    hasInstance() {
      return hasOwn(this, singletonSymbol);
    }
  }
})
