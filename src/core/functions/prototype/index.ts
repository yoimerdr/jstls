import {protoapply} from "./apply";
import {Instanceable, InstanceableParameters, InstanceableType, SafeReturnType} from "@jstls/types/core";
import {slice} from "@jstls/core/iterable";

/**
 * Calls the constructor of a class on an instance.
 *
 * @example
 * function A(val) {
 *   this.val = val;
 * }
 * const a = Object.create(A.prototype);
 * constructor(A, a, 1);
 * console.log(a.val); // 1
 *
 * @param cls The class constructor.
 * @param instance The instance to initialize.
 * @param args The arguments to pass to the constructor.
 */
export function constructor<T extends Instanceable>(cls: T, instance: InstanceableType<T>, ...args: InstanceableParameters<T>): SafeReturnType<InstanceableType<T>>;
export function constructor<T extends Instanceable>(cls: T, instance: InstanceableType<T>): SafeReturnType<InstanceableType<T>> {
  return protoapply(cls, "constructor", instance, slice(arguments, 2) as any)
}





