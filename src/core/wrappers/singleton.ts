import {readonly} from "../definer";
import {SingletonConstructor} from "../../types/core/wrappers";
import {Instanceable, InstanceableType} from "../../types/core";
import {IllegalAccessError} from "../exceptions";
import {isDefined, isFunction} from "../objects/types";
import {is} from "../polyfills/objects/es2015";
import {uid} from "../polyfills/symbol";
import {get} from "../objects/handlers";
import {slice} from "../iterable";
import {apply} from "../functions/apply";
import {hasOwn} from "../polyfills/objects/es2022";
import {SingletonInit} from "../../types/core/wrappers/singleton";

const singletonSymbol = uid('SingletonInstance');

function checkSingleton(target: Object, init?: SingletonInit<any>) {
  const instance = get(target.constructor, singletonSymbol);
  if (instance)
    return instance;
  if (isDefined(init))
    apply(init!, target, [target]);
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
  return isFunction(context) ? checkSingleton(target, context) : class extends target {
    constructor(...args: any) {
      super(...slice(arguments));
      return checkSingleton(this)
    }
  }
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
export class Singleton<S extends Singleton<S>> {
  constructor(init?: SingletonInit<S>) {
    if (is(this.constructor, Singleton))
      throw new IllegalAccessError('[Singleton] The Singleton class not allowed to be instantiated. Is only allowed to be extended.');
    return checkSingleton(this, init)
  }


  // @ts-ignore
  static getInstance<T extends Singleton<T>>(this: T, ...args: ConstructorParameters<T>): InstanceableType<T>;
  static getInstance<T extends Singleton<T>>(this: T): InstanceableType<T>;
  static getInstance<T extends Singleton<T>>(this: SingletonConstructor<T>): InstanceableType<T> {
    if (!get(this, singletonSymbol))
      readonly(this, singletonSymbol, new (apply(this.bind as any, this, [null].concat(slice(arguments))))());
    return get(this, singletonSymbol);
  }

  static hasInstance(): boolean;
  static hasInstance(this: SingletonConstructor<any>): boolean {
    return hasOwn(this, singletonSymbol)
  }
}

