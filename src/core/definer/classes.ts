import {KeyableObject} from "../../types/core/objects";
import {props} from "./props";
import {requireObject} from "../objects/validators";
import {keys} from "../objects/handlers/properties";
import {reduce} from "../iterable";
import {Instanceable, InstanceableType} from "../../types/core";
import {ES5ClassOptions} from "../../types/core/definer";
import {descriptor} from "./shared";

function toDescriptor(source: any): KeyableObject<PropertyDescriptor> {
  return reduce(keys(source), (current, key) => {
    current[key] = descriptor(source[key], true, true, true)
    return current;
  }, <KeyableObject<PropertyDescriptor>>{})
}

export function es5class<T, I extends Instanceable<T>>(callable: I, options: ES5ClassOptions<InstanceableType<I>, I>): Instanceable<InstanceableType<I>>;
export function es5class<T, I extends Instanceable>(callable: I, options: ES5ClassOptions<InstanceableType<I>, I>): Instanceable<InstanceableType<I>>;
export function es5class<T>(callable: Function, options: ES5ClassOptions<T>): Instanceable<T> {
  requireObject(options, "options");
  requireObject(callable.prototype);

  if (options.statidescriptor)
    props(callable, options.statidescriptor);

  if (options.statics)
    props(callable, toDescriptor(options.statics));

  if (options.protodescriptor)
    props(callable.prototype, options.protodescriptor);

  props(callable.prototype, toDescriptor(options.prototype));

  return callable as Instanceable<T>;
}
