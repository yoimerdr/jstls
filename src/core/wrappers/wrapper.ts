import {EmptyFunctionType, FunctionType, Maybe} from "@jstls/types/core";
import {readonly2} from "@jstls/core/definer";
import {apply} from "@jstls/core/functions/apply";
import {isFunction} from "@jstls/core/objects/types";
import {requireFunction} from "@jstls/core/objects/validators";
import {funclass2} from "@jstls/core/definer/classes/funclass";
import {WithPrototype} from "@jstls/types/core/objects";
import {FunctionClassSimpleStatics} from "@jstls/types/core/definer";
import {simple} from "@jstls/core/definer/getters/builders";
import {partial} from "@jstls/core/functions/partial";

export interface Wrapper<T> {
  /**
   * The wrapped value;
   * @readonly
   */
  readonly value: T;

  /**
   * Gets the wrapped value.
   * @template T
   * @type T
   * @see {get}
   * @see {value}
   */
  valueOf(): T;

  toString(): string;

  /**
   * Gets the wrapped value.
   * @template T
   * @type T
   */
  get(): T;

  /**
   * Apply the fn param to the wrapped value.
   *
   * The `this` reference in fn will be the wrapped value.
   * @param {(this: T) => void} fn The function to apply.
   * @template T
   */
  apply(fn: Maybe<EmptyFunctionType<T>>): this;

  vapply<R>(fn: EmptyFunctionType<T, R>): R;

  /**
   * Apply the fn parameter to this wrapper.
   *
   * The `this` reference in fn will be the wrappers.
   * @param {(this: Wrapper<T,Wrapper<T, any>>) => void} fn The function to apply.
   * @template T
   */
  wapply(fn: Maybe<EmptyFunctionType<this>>): this;

  /**
   * @deprecated
   * @param fn
   */
  applyWrapper(fn: Maybe<EmptyFunctionType<this>>): this;

  let<R>(fn: Maybe<FunctionType<this, [value: T], R>>): R;
}

export interface WrapperConstructor extends WithPrototype<Wrapper<any>> {
  /**
   * @constructor
   * Create a new Wrapper object.
   * @template T
   * @param {T} value The value to wrap.
   */
  new<T>(value: T): Wrapper<T>;
}

function wapply(this: Wrapper<any>, fn: any) {
  const $this = this;
  isFunction(fn) && apply(fn!, $this);
  return $this;
}

/**
 * @class
 * The base wrappers class.
 *
 * Wrap a value for use utils conversions.
 * @template T
 */
export const Wrapper: WrapperConstructor = funclass2({
  construct: function (value) {
    readonly2(this, "value", value);
  },
  prototype: <FunctionClassSimpleStatics<Wrapper<unknown>>>{
    get: partial(simple, 'value'),
    apply(fn) {
      const $this = this;
      isFunction(fn) && apply(fn!, $this.get())
      return $this;
    },
    vapply(fn) {
      requireFunction(fn, "fn");
      return apply(fn, this.get());
    },
    wapply,
    applyWrapper: wapply,
    let(fn) {
      fn = requireFunction(fn, "fn");
      const $this = this;
      return apply(fn, $this, [$this.get()]) as any;
    }
  }
})

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
