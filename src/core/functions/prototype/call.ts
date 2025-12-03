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

/**
 * Calls a method from the Array prototype on an array-like instance.
 *
 * @example
 * const arr = [1, 2];
 * protocall(Array, 'push', arr, 3);
 * console.log(arr); // [1, 2, 3]
 *
 * @param cls The Array constructor.
 * @param key The method name.
 * @param instance The array-like instance.
 * @param args The arguments to pass to the method.
 */
export function protocall<T extends ArrayConstructor, P extends InstanceMethodKeys<T>>(cls: T, key: P | PropertyKey, instance: ArrayLike, ...args: InstanceMethodParameters<T, P>): InstanceMethodReturn<T, P>;
/**
 * Calls a method from a class prototype on an instance.
 *
 * @example
 * function A() {
 *   this.val = 1;
 *   this.add = function(n) { return this.val + n; }
 * }
 * const a = new A();
 * protocall(A, 'add', a, 2); // 3
 *
 * @param cls The class constructor.
 * @param key The method name.
 * @param instance The instance to call the method on.
 * @param args The arguments to pass to the method.
 */
export function protocall<T extends Instanceable, P extends InstanceMethodKeys<T>>(cls: T, key: P | PropertyKey, instance: InstanceableType<T>, ...args: InstanceMethodParameters<T, P>): InstanceMethodReturn<T, P>;
export function protocall<T extends Instanceable, P extends InstanceMethodKeys<T>>(cls: T, key: P | PropertyKey, instance: InstanceableType<T>,): InstanceMethodReturn<T, P> {
  return apply(cls.prototype[key], instance, slice(arguments, 3));
}
