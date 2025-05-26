import {
  Instanceable,
  InstanceableParameters,
  InstanceableType,
  InstanceMethodKeys,
  InstanceMethodParameters,
  InstanceMethodReturn,
  SafeReturnType,
  Split
} from "@jstls/types/core";
import {slice} from "@jstls/core/iterable";
import {apply} from "@jstls/core/functions/apply";
import {readonly2} from "@jstls/core/definer";
import {funclass2} from "@jstls/core/definer/classes/funclass";
import {WithPrototype} from "@jstls/types/core/objects";
import {FunctionClassSimpleStatics} from "@jstls/types/core/definer";
import {concat} from "@jstls/core/shortcuts/indexable";
import {nullable} from "@jstls/core/utils/types";
import {mixerInit, mixerSuper} from "./shared";

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

export const Mixer: MixerConstructor = funclass2({
  construct: function (target) {
    readonly2(this, "target", target);
  },
  prototype: <FunctionClassSimpleStatics<Mixer<any>>>{
    super(cls, key, ...args) {
      return apply(mixerSuper, nullable, <any> concat([this.target, cls, key,], slice(arguments, 2)))
    },
    init(cls, ...args) {
      return apply(mixerInit, nullable, <any> concat([this.target, cls], slice(arguments, 2)))
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


