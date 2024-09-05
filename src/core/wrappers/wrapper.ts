import {Maybe} from "../../types/core";
import {readonlys} from "../definer";
import {isFunction} from "../objects/types";
import {requiredWithType} from "../objects/validators";
import {apply} from "../utils/functions";


/**
 * @class
 * The base wrappers class.
 *
 * Wrap a value for use utils conversions.
 * @template T
 */
export class Wrapper<T> {
  /**
   * The wrapped value;
   * @readonly
   */
  readonly value!: T;

  /**
   * @constructor
   * Create a new Wrapper object.
   * @template T
   * @param {T} value The value to wrap.
   */
  constructor(value: T) {
    readonlys(this as Wrapper<T>, {
      value: <any> value
    })
  }

  /**
   * Gets the wrapped value.
   * @template T
   * @type T
   * @see {get}
   * @see {value}
   */
  valueOf(): T {
    return this.value;
  }

  toString(): string {
    return (this.get() as Object).toString()
  }

  /**
   * Gets the wrapped value.
   * @template T
   * @type T
   */
  get(): T {
    return this.value;
  }

  /**
   * Apply the fn param to the wrapped value.
   *
   * The `this` reference in fn will be the wrapped value.
   * @param {(this: T) => void} fn The function to apply.
   * @template T
   */
  apply(fn: Maybe<(this: T) => void>): this {
    if (isFunction(fn))
      apply(fn!, this.value);
    return this;
  }

  /**
   * Apply the fn parameter to this wrapper.
   *
   * The `this` reference in fn will be the wrappers.
   * @param {(this: Wrapper<T,Wrapper<T, any>>) => void} fn The function to apply.
   * @template T
   */
  applyWrapper(fn: Maybe<(this: this) => void>): this {
    if (isFunction(fn))
      apply(fn!, this)
    return this
  }

  let<R>(fn: Maybe<(this: this, value: T) => R>): R {
    fn = requiredWithType(fn, "function", "fn")
    return apply(fn, this, [this.value]) as R;
  }
}

/**
 * Wrap the parameter with {@link Wrapper}
 * @param {T} value The value to wrap.
 *
 * @returns {Wrapper<T, Wrapper<T, any>>} A new {@link Wrapper} instance.
 * @template T
 */
export function wrap<T>(value: T): Wrapper<T> {
  return new Wrapper(value)
}
