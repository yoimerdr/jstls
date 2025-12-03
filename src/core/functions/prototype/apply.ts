import {
  Instanceable,
  InstanceableType,
  InstanceMethodKeys,
  InstanceMethodParameters,
  InstanceMethodReturn
} from "@jstls/types/core";
import {ArrayLike} from "@jstls/types/core/array";
import {apply} from "@jstls/core/functions/apply";

/**
 * Applies a method from a class prototype to an instance.
 *
 * @example
 *
 * function A() {
 *   this.val = 1;
 *   this.add = function(n) { return this.val + n; }
 * }
 * const a = new A();
 * protoapply(A, 'add', a, [2]); // 3
 *
 * @param cls The class constructor.
 * @param key The method name.
 * @param instance The instance to apply the method to.
 * @param args The arguments to pass to the method.
 */
export function protoapply<T extends Instanceable, P extends InstanceMethodKeys<T>>(cls: T, key: P | PropertyKey, instance: InstanceableType<T>, args: InstanceMethodParameters<T, P>): InstanceMethodReturn<T, P>;
/**
 * Applies a method from the Array prototype to an array-like instance.
 *
 * @example
 * const arr = [1, 2];
 * protoapply(Array, 'push', arr, [3]);
 * console.log(arr); // [1, 2, 3]
 *
 * @param cls The Array constructor.
 * @param key The method name.
 * @param instance The array-like instance.
 * @param args The arguments to pass to the method.
 */
export function protoapply<T extends ArrayConstructor, P extends InstanceMethodKeys<T>>(cls: T, key: P | PropertyKey, instance: ArrayLike, args: InstanceMethodParameters<T, P>): InstanceMethodReturn<T, P>;
export function protoapply<T extends Instanceable, P extends InstanceMethodKeys<T>>(cls: T, key: P, instance: InstanceableType<T>, args: InstanceMethodParameters<T, P>): InstanceMethodReturn<T, P> {
  return apply(cls.prototype[key], instance, arguments[3]);
}
