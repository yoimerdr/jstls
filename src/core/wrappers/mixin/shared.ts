import {
  Instanceable,
  InstanceableParameters, InstanceableType,
  InstanceMethodKeys,
  InstanceMethodParameters, InstanceMethodReturn,
  SafeReturnType
} from "@jstls/types/core";
import {IllegalArgumentError} from "@jstls/core/exceptions/illegal-argument";
import {IllegalAccessError} from "@jstls/core/exceptions/illegal-access";
import {getMixinBases} from "./mixin";
import {protoapply} from "@jstls/core/functions/prototype/apply";
import {slice} from "@jstls/core/iterable";

function checkMixin(instance: Object) {
  const bases: any[] = getMixinBases(instance);
  if (!bases)
    throw new IllegalAccessError("The instance does not have a mixin key.");
  return bases;
}

function checkMixer(instance: Object, cls: any) {
  const bases = checkMixin(instance);
  if (bases.indexOf(cls) === -1)
    throw new IllegalArgumentError("The instance does not inherits from the passed cls.")
}

/**
 * Apply the base class method with the {@link target} instance as this argument.
 * @example
 *
 * @param target The target mixed class instance.
 * @param cls The base class with which the instance has been mixed.
 * @param key The property name (method).
 * @param args The method args.
 */
export function mixerSuper<I extends Instanceable, P extends InstanceMethodKeys<I>>(target: Object, cls: I, key: P, ...args: InstanceMethodParameters<I, P>): InstanceMethodReturn<I, P> {
  checkMixer(target, cls);
  return protoapply(<any>cls, key, target, slice(arguments, 3));
}

/**
 * Apply the base class constructor with the {@link target} instance as this argument.
 * @param cls The base class with which the instance has been mixed.
 * @param target The target mixed class instance.
 * @param args The constructor args.
 */
export function mixerInit<I extends Instanceable>(target: Object, cls: I, ...args: InstanceableParameters<I>): SafeReturnType<InstanceableType<I>> {
  checkMixer(target, cls);
  return protoapply(<any>cls, "constructor", target, slice(arguments, 2));
}
