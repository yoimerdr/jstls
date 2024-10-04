import {readonly} from "../definer";
import {SingletonConstructor} from "../../types/core/wrappers";
import {ConstructorParameters, ConstructorType, MaybeBoolean, Mutable} from "../../types/core";
import {IllegalAccessError} from "../exceptions";
import {isDefined} from "../objects/types";
import {is} from "../polyfills/objects/es2015";
import {uid} from "../polyfills/symbol";
import {get} from "../objects/handlers";
import {slice} from "../iterable";
import {name} from "../functions";
import {apply} from "../functions/apply";

const instanceSymbol = uid('SingletonInstance');
export class Singleton<S extends Singleton<S>> {
  protected constructor(init?: (this: Mutable<S>, instance: Mutable<S>) => void, strict?: MaybeBoolean) {
    if (is(this.constructor, Singleton))
      throw new IllegalAccessError('[Singleton] The Singleton class not allowed to be instantiated. Is only allowed to be extended.')
    if (get(this.constructor, instanceSymbol)) {
      if (strict)
        throw new IllegalAccessError(`[Singleton] Instance for ${name(this.constructor)} class already exists.`)
      return get(this.constructor, instanceSymbol);
    }
    if (isDefined(init))
      apply<any>(init, this, [this])
    readonly(this.constructor, instanceSymbol, this);
  }


  // @ts-ignore
  static getInstance<T extends Singleton<T>>(this: T, ...args: ConstructorParameters<T>): ConstructorType<T>;
  static getInstance<T extends Singleton<T>>(this: T): ConstructorType<T>;
  static getInstance<T extends Singleton<T>>(this: SingletonConstructor<T>): ConstructorType<T> {
    if (!get(this, instanceSymbol))
      readonly(this, instanceSymbol, new (apply(this.bind as any, this, [null].concat(slice(arguments))))());
    return get(this, instanceSymbol);
  }

  static hasInstance(): boolean;
  static hasInstance(this: SingletonConstructor<any>): boolean {
    return get(this, instanceSymbol)
  }
}

