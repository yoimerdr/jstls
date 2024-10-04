import {Wrapper} from "../wrapper";
import {Maybe} from "../../../types/core";
import {readonlys} from "../../definer";
import {isDefined} from "../../objects/types";
import {apply} from "../../functions/apply";


/**
 * @class
 * The optional class.
 * @template T
 */
export class Optional<T> extends Wrapper<Maybe<T>> {
  /**
   * @constructor
   * Create a new Optional object.
   * @template T
   * @param {Maybe<T>} value The nullable value to wrap.
   */
  constructor(value: Maybe<T>) {
    super(value);
    readonlys(this as Optional<T>, {
      isPresent: isDefined(value),
      isNotPresent: !isDefined(value)
    })
  }

  /**
   * True if the value is defined, false otherwise.
   * @see {isDefined}
   * @type boolean
   */
  readonly isPresent!: boolean;

  /**
   * False if the value is defined, true otherwise.
   * @see {isPresent}
   * @see {isDefined}
   * @type boolean
   */
  readonly isNotPresent!: boolean

  /**
   * Gets the wrapped value {@link isPresent}.
   * @param {(this: this) => NonNullable<T>} builder The default builder value.
   * @template T
   * @see {Optional.get}
   */
  sget(builder: (this: this) => NonNullable<T>): NonNullable<T> {
    return this.isPresent ? this.value as NonNullable<T> : apply(builder, this);
  }

  /**
   * Similar to {@link Optional.apply}, but only works if the value {@link isPresent}
   * @param {(this: T) => void} fn The function to apply.
   */
  sapply(fn: Maybe<(this: NonNullable<T>) => void>): this {
    return this.isPresent ? this.apply(fn as any) : this;
  }

  slet<R, O extends Optional<R> = Optional<R>>(fn: Maybe<(this: this, value: NonNullable<T>) => R>): O {
    return new Optional<R>(this.isPresent ? this.let(fn as any) : undefined) as any
  }

  /**
   * Call the fn if the wrapped value {@link isPresent}.
   *
   * The `this` reference on fn is the Optional object, and the wrapped value is passed as argument.
   * @param {(this: this, value: NonNullable<T>) => void} fn The function to apply.
   * @template T
   * @see {Optional.sapply}
   */
  ifPresent(fn: Maybe<(this: this, value: NonNullable<T>) => void>): this {
    if (this.isPresent)
      apply(fn!, this, [this.value as NonNullable<T>]);
    return this;
  }
}

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
