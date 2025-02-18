import {Optional} from "./optional";
import {readonlys} from "../../definer";
import {IllegalAccessError} from "../../exceptions";
import {Keys, Maybe, MaybeKeyType} from "../../../types/core";
import {KeyableObject, MaybeKeyObjectType} from "../../../types/core/objects";
import {isDefined, isFunction, isObject} from "../../objects/types";
import {keys} from "../../objects/handlers/properties";
import {apply} from "../../functions/apply";
import {forEach} from "../../shortcuts/array";

function checkObjectAccess(optional: OptionalProperties<any>) {
  if (optional.isPresent && !optional.hasObject)
    throw new IllegalAccessError(`The method is only access for object-like values, current type is ${typeof optional.value}`);
  return optional.isPresent;
}


/**
 * @class
 * The OptionalProperties class.
 * @template T
 */
export class OptionalProperties<T> extends Optional<T> {
  /**
   * True if the value is object, false otherwise.
   * @see {isObject}
   * @type boolean
   */
  readonly hasObject!: boolean;

  constructor(value: Maybe<T>) {
    super(value);
    readonlys(this as OptionalProperties<T>, {
      hasObject: isObject(this.value)
    })
  }

  slet<R, O = OptionalProperties<R>>(fn: Maybe<(this: OptionalProperties<T>, value: NonNullable<T>) => R>): O {
    return new OptionalProperties<R>(this.isPresent ? this.let(fn as any) : undefined) as any
  }

  /**
   * Checks if the wrapped value property is defined and returns it.
   * @param key The property key.
   * @param builder The default value builder.
   * @param assign If true, assigns the value returned by the builder param to the wrapped value.
   * @see {getDefined}
   */
  prop<P extends Keys<T> | PropertyKey>(key: P, builder?: (this: this) => MaybeKeyObjectType<T, P>, assign?: boolean): MaybeKeyType<T, P> {
    let value: MaybeKeyType<T, P> = undefined!;
    if (checkObjectAccess(this))
      value = (<KeyableObject>this.value)[key];
    if (assign && !isDefined(value) && isFunction(builder)) {
      value = apply(builder!, this) as any;
      (<KeyableObject>this.value)[key] = value;
    }
    return value
  }

  /**
   * Wraps the value returns by {@link prop} with the {@link OptionalProperties} class.
   * @param key The property key.
   */
  sprop<P extends Keys<T> | PropertyKey>(key: P): OptionalProperties<MaybeKeyType<T, P>> {
    return new OptionalProperties(this.prop(key))
  }

  /**
   * Iterates on each enumerable property and apply fn.
   * @param fn The fn callback.
   */
  ikeys(fn: Maybe<(this: NonNullable<T>, key: Keys<T>) => void>): this {
    if (checkObjectAccess(this) && isFunction(fn)) {
      forEach(keys(this.value as T), function (key) {
        apply(fn!, this, [key])
      }, this.value!);
    }
    return this;
  }

  /**
   * Wrap the value with the {@link Optional} class.
   */
  optional() {
    return new Optional(this.value)
  }
}

/**
 * Wrap the parameter with {@link OptionalProperties}
 * @param {Maybe<T>} value The value to wrap.
 *
 * @returns {OptionalProperties<T>} A new {@link OptionalProperties} instance.
 * @template T
 */
export function optionalProperties<T>(value: Maybe<T>): OptionalProperties<T> {
  return new OptionalProperties(value);
}
