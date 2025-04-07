import {Wrapper} from "../wrapper";
import {Maybe} from "../../../types/core";
import {readonlys2} from "../../definer";
import {isDefined} from "../../objects/types";
import {apply} from "../../functions/apply";
import {WithPrototype} from "../../../types/core/objects";
import {funclass2} from "../../definer/classes/funclass";
import {call} from "../../functions/call";
import {FunctionClassSimpleStatics} from "../../../types/core/definer";
import {requireFunction} from "../../objects/validators";
import {indefinite} from "../../utils/types";

export interface Optional<T> extends Wrapper<Maybe<T>> {
  /**
   * True if the value is defined, false otherwise.
   * @see {isDefined}
   * @type boolean
   */
  readonly isPresent: boolean;

  /**
   * False if the value is defined, true otherwise.
   * @see {isPresent}
   * @see {isDefined}
   * @type boolean
   */
  readonly isNotPresent: boolean;

  /**
   * Gets the wrapped value {@link isPresent}.
   * @param {(this: this) => NonNullable<T>} builder The default builder value.
   * @template T
   * @see {Optional.get}
   */
  sget(builder: (this: this) => NonNullable<T>): NonNullable<T>;

  /**
   * Similar to {@link Optional.apply}, but only works if the value {@link isPresent}
   * @param {(this: NonNullable<T>) => void} fn The function to apply.
   */
  sapply(fn: Maybe<(this: NonNullable<T>) => void>): this;

  slet<R, O extends Optional<R> = Optional<R>>(fn: Maybe<(this: this, value: NonNullable<T>) => R>): O

  /**
   * Call the fn if the wrapped value {@link isPresent}.
   *
   * The `this` reference on fn is the Optional object, and the wrapped value is passed as argument.
   * @param {(this: this, value: NonNullable<T>) => void} fn The function to apply.
   * @template T
   * @see {Optional.sapply}
   */
  ifPresent(fn: Maybe<(this: this, value: NonNullable<T>) => void>): this;
}

export interface OptionalConstructor extends WithPrototype<Optional<any>> {
  new<T>(value: Maybe<T>): Optional<T>;
}

/**
 * @constructor
 * Create a new Optional object.
 * @template T
 * @param {Maybe<T>} value The nullable value to wrap.
 */
export const Optional: OptionalConstructor = funclass2({
  construct: function (value) {
    const isPresent = isDefined(value)
    readonlys2(this, {
      isPresent,
      isNotPresent: !isPresent
    });
  },
  prototype: <FunctionClassSimpleStatics<Optional<unknown>>>{
    sget(builder) {
      const $this = this;
      return $this.isPresent ? $this.get() : apply(builder, $this);
    },
    sapply(fn) {
      const $this = this;
      return $this.isPresent ? $this.apply(fn as any) : $this;
    },
    slet(fn) {
      const $this = this;
      return new Optional($this.isPresent ? $this.let(fn as any) : indefinite);
    },
    ifPresent(fn) {
      requireFunction(fn, "fn");
      const $this = this;
      $this.isPresent && call(fn!, $this, $this.get());
      return $this;
    },
  }
}, Wrapper);


/**
 * Wrap the parameter with {@link Optional}
 * @param {Maybe<T>} value The value to wrap.
 *
 * @returns {Optional<T>} A new {@link Optional} instance.
 * @template T
 */
export function optionalOf<T>(value: Maybe<T>): Optional<T> {
  return new Optional(value);
}
