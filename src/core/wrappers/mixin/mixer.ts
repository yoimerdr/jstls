import {
  Instanceable,
  InstanceableParameters,
  InstanceableType,
  InstanceMethodKeys,
  InstanceMethodParameters,
  InstanceMethodReturn,
  SafeReturnType,
  Split
} from "../../../types/core";
import {IllegalAccessError, IllegalArgumentError} from "../../exceptions";
import {protoapply} from "../../functions/prototype";
import {slice} from "../../iterable";
import {apply} from "../../functions/apply";
import {readonly2} from "../../definer";
import {getMixinBases} from "./mixin";
import {funclass} from "../../definer/classes";
import {WithPrototype} from "../../../types/core/objects";
import {FunctionClassSimpleStatics} from "../../../types/core/definer";
import {concat} from "../../shortcuts/indexable";

function checkMixin(instance: Object) {
  const bases: any[] = getMixinBases(instance);
  if (!bases)
    throw new IllegalAccessError("The instance does not have a mixin key.");
  return bases;
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

function checkMixer(instance: Object, cls: any) {
  const bases = checkMixin(instance);
  if (bases.indexOf(cls) === -1)
    throw new IllegalArgumentError("The instance does not inherits from the passed cls.")
}

export interface Mixer<T extends Instanceable[]> {
  readonly target: Object;

  /**
   * Apply the base class method with the {@link target} instance as this argument.
   * @param cls The base class with which the instance has been mixed.
   * @param key The property name (method).
   * @param args The method args.
   */
  super<I extends Split<T>, P extends InstanceMethodKeys<I>>(cls: I, key: P, ...args: InstanceMethodParameters<I, P>): InstanceMethodReturn<I, P>;

  /**
   * Apply the base class constructor with the {@link target} instance as this argument.
   * @param cls The base class with which the instance has been mixed.
   * @param args The constructor args.
   */
  init<I extends Split<T>>(cls: I, ...args: InstanceableParameters<I>): SafeReturnType<InstanceableType<T>>;
}

export interface MixerConstructor extends WithPrototype<Mixer<any>> {
  /**
   * @param target The target mixed class instance.
   */
  new<T extends Instanceable[] = any>(target: Object): Mixer<T>;
}

export const Mixer: MixerConstructor = funclass({
  construct(target) {
    readonly2(this, "target", target);
  },
  prototype: <FunctionClassSimpleStatics<Mixer<any>>>{
    super(cls, key, ...args) {
      return apply(mixerSuper, null, concat([this.target, cls, key,], slice(arguments, 2)))
    },
    init(cls, ...args) {
      return apply(mixerInit, null, concat([this.target, cls], slice(arguments, 2)))
    }
  }
})

/**
 * Creates a new mixer.
 * @param target The mixed class instance.
 */
export function mixer<T extends Instanceable[] = any>(target: Object): Mixer<T> {
  return new Mixer(target)
}


