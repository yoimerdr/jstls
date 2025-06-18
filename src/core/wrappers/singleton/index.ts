import {Instanceable, InstanceableParameters, InstanceableType} from "@jstls/types/core";
import {IllegalAccessError} from "@jstls/core/exceptions/illegal-access";
import {is} from "@jstls/core/polyfills/objects/es2015";
import {slice} from "@jstls/core/iterable";
import {apply} from "@jstls/core/functions/apply";
import {SingletonInit} from "@jstls/types/core/wrappers/singleton";
import {funclass2} from "@jstls/core/definer/classes/funclass";
import {nullable} from "@jstls/core/utils/types";
import {WithPrototype} from "@jstls/types/core/objects";
import {concat} from "@jstls/core/shortcuts/indexable";
import {checkSingleton, getInstance, hasInstance} from "@jstls/core/wrappers/singleton/fn";

export {getInstance, hasInstance, removeInstance, singleton} from "./fn";


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
      throw new IllegalAccessError('The Singleton class not allowed to be instantiated. Is only allowed to be extended.');
    return checkSingleton($this, init)
  },
  statics: {
    getInstance() {
      const $this = this;
      if (!getInstance($this))
        checkSingleton(new (apply($this.bind as any as Instanceable, $this, concat([<any>nullable], slice(arguments))))());
      return getInstance($this);
    },
    hasInstance() {
      return hasInstance(this);
    }
  }
})
