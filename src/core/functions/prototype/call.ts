import {
  Instanceable,
  InstanceableType,
  InstanceMethodKeys,
  InstanceMethodParameters,
  InstanceMethodReturn
} from "@jstls/types/core";
import {ArrayLike} from "@jstls/types/core/array";
import {apply} from "@jstls/core/functions/apply";
import {slice} from "@jstls/core/iterable";

export function protocall<T extends ArrayConstructor, P extends InstanceMethodKeys<T>>(cls: T, key: P | PropertyKey, instance: ArrayLike, ...args: InstanceMethodParameters<T, P>): InstanceMethodReturn<T, P>;
export function protocall<T extends Instanceable, P extends InstanceMethodKeys<T>>(cls: T, key: P | PropertyKey, instance: InstanceableType<T>, ...args: InstanceMethodParameters<T, P>): InstanceMethodReturn<T, P>;
export function protocall<T extends Instanceable, P extends InstanceMethodKeys<T>>(cls: T, key: P | PropertyKey, instance: InstanceableType<T>, ...args: InstanceMethodParameters<T, P>): InstanceMethodReturn<T, P> {
  return apply(cls.prototype[key], instance, slice(arguments, 3));
}
