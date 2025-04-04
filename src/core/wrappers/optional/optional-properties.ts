import {Optional} from "./optional";
import {readonly2} from "../../definer";
import {IllegalAccessError} from "../../exceptions";
import {Keys, Maybe, MaybeKeyType} from "../../../types/core";
import {KeyableObject, MaybeKeyObjectType, WithPrototype} from "../../../types/core/objects";
import {isDefined, isFunction, isObject} from "../../objects/types";
import {keys} from "../../objects/handlers/properties";
import {apply} from "../../functions/apply";
import {forEach} from "../../shortcuts/array";
import {concat} from "../../shortcuts/string";
import {funclass} from "../../definer/classes/";
import {call} from "../../functions/call";
import {FunctionClassSimpleStatics} from "../../../types/core/definer";
import {indefinite} from "../../utils/types";

function checkObjectAccess(optional: OptionalProperties<any>) {
  const present = optional.isPresent;
  if (present && !optional.hasObject)
    throw new IllegalAccessError(concat("The method is only access for object-like values, current type is ", typeof optional.value));
  return present;
}

export interface OptionalProperties<T> extends Optional<T> {
  /**
   * True if the value is object, false otherwise.
   * @see {isObject}
   * @type boolean
   */
  readonly hasObject: boolean;

  /**
   * Checks if the wrapped value property is defined and returns it.
   * @param key The property key.
   * @param builder The default value builder.
   * @param assign If true, assigns the value returned by the builder param to the wrapped value.
   * @see {getDefined}
   */
  prop<P extends Keys<T> | PropertyKey>(key: P, builder?: (this: this) => MaybeKeyObjectType<T, P>, assign?: boolean): MaybeKeyType<T, P>;

  /**
   * Wraps the value returns by {@link prop} with the {@link OptionalProperties} class.
   * @param key The property key.
   */
  sprop<P extends Keys<T> | PropertyKey>(key: P): OptionalProperties<MaybeKeyType<T, P>>

  /**
   * Iterates on each enumerable property and apply fn.
   * @param fn The fn callback.
   */
  ikeys(fn: Maybe<(this: NonNullable<T>, key: Keys<T>) => void>): this;

  /**
   * Wrap the value with the {@link Optional} class.
   */
  optional(): Optional<T>;
}


export interface OptionalPropertiesConstructor extends WithPrototype<OptionalProperties<any>> {
  new<T>(value: Maybe<T>): OptionalProperties<T>;
}


export const OptionalProperties: OptionalPropertiesConstructor = funclass<OptionalPropertiesConstructor>({
  construct: function (value) {
    readonly2(this, "hasObject", isObject(value));
  },
  prototype: <FunctionClassSimpleStatics<OptionalProperties<unknown>>>{
    slet(fn) {
      const $this = this;
      return new OptionalProperties($this.isPresent ? $this.let(fn as any) : indefinite)
    },
    prop(key, builder, assign) {
      const $this = this;
      let value: unknown = indefinite;

      checkObjectAccess($this) && (value = ($this.value as KeyableObject)[key]);

      if (assign && !isDefined(value) && isFunction(builder)) {
        value = apply(builder!, this) as any;
        (<KeyableObject>$this.value)[key] = value;
      }

      return value;
    },
    sprop(key) {
      return new OptionalProperties(this.prop(key));
    },
    ikeys(fn) {
      const $this = this,
        value = $this.value;
      if (checkObjectAccess($this) && isFunction(fn)) {
        forEach(keys(value), (key) => call(fn!, value, key))
      }
      return $this;
    },
    optional() {
      return new Optional(this.value);
    }
  }
}, Optional);

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
