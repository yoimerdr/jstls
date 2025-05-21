import {isDefined} from "@jstls/core/objects/types";
import {Maybe} from "@jstls/types/core";
import {apply} from "@jstls/core/functions/apply";

/**
 * Checks if the value is defined and returns it.
 * @param value The value to checks.
 * @param builder The default value builder.
 * @param thisArg The this arg for the builder.
 * @return The value param if is defined, else, the value returned by the builder.
 * @see {isDefined}
 */
export function getDefined<T, R>(value: Maybe<T>, builder: (this: R) => T, thisArg?: R): T {
  return isDefined(value) ? value! : getIf(value, isDefined, builder, thisArg);
}

/**
 * Checks if the value meets the given condition and returns it,
 * @param value The value to checks.
 * @param condition The condition that the value must meet.
 * @param builder The default value builder.
 * @param thisArg The this arg for the builder.
 * @return The value param if meets the condition, else, the value returned by the builder.
 */
export function getIf<T, R>(value: Maybe<T>, condition: (value: Maybe<T>) => boolean, builder: (this: R) => T, thisArg?: R): T {
  if (condition(value))
    return value!;
  value = apply(builder, thisArg!);
  return value;
}
