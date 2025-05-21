import {protoapply} from "./apply";
import {Instanceable, InstanceableParameters, InstanceableType, SafeReturnType} from "@/types/core";
import {slice} from "@/core/iterable";

export function constructor<T extends Instanceable>(cls: T, instance: InstanceableType<T>, ...args: InstanceableParameters<T>): SafeReturnType<InstanceableType<T>> {
  return protoapply(cls, "constructor", instance, slice(arguments, 2) as any)
}





