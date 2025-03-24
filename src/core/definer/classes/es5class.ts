import {Instanceable, InstanceableFunction, InstanceableType} from "../../../types/core";
import {ES5ClassOptions} from "../../../types/core/definer";
import {requireObject} from "../../objects/validators";
import {props} from "../props";
import {sourceToDescriptor} from "./funclass";

/**
 * Modify function to use as class.
 * @param callable The function.
 * @param options The class options.
 * @deprecated A more complete version of this action is available at {@link funclass}
 */
export function es5class<I extends Instanceable<T>, T, >(callable: I, options: ES5ClassOptions<InstanceableType<I>, I>): Instanceable<InstanceableType<I>>;
/**
 * Modify function to use as class.
 * @param callable The function.
 * @param options The class options.
 * @deprecated A more complete version of this action is available at {@link funclass}
 */
export function es5class<I extends Instanceable, T>(callable: I, options: ES5ClassOptions<InstanceableType<I>, I>): Instanceable<InstanceableType<I>>;
/**
 * Modify function to use as class.
 * @param callable The function.
 * @param options The class options.
 * @deprecated A more complete version of this action is available at {@link funclass}
 */
export function es5class<I extends Instanceable, T = InstanceableType<I>>(callable: InstanceableFunction<I>, options: ES5ClassOptions<T>): I;
/**
 * Modify function to use as class.
 * @param callable The function.
 * @param options The class options.
 * @deprecated A more complete version of this action is available at {@link funclass}
 */
export function es5class<I extends Instanceable, T = InstanceableType<I>>(callable: Function, options: ES5ClassOptions<T>): I;
/**
 * Modify function to use as class.
 * @param callable The function.
 * @param options The class options.
 * @deprecated A more complete version of this action is available at {@link funclass}
 */
export function es5class<T>(callable: Function, options: ES5ClassOptions<T>): Instanceable<T>
export function es5class<T>(callable: Function, options: ES5ClassOptions<T>): Instanceable<T> {
  requireObject(options, "options");
  const funPrototype = callable.prototype;
  requireObject(funPrototype);

  const {statics, statidescriptor, protodescriptor, prototype} = options;

  statidescriptor && props(callable, statidescriptor);

  statics && props(callable, sourceToDescriptor(statics));

  protodescriptor && props(funPrototype, protodescriptor);

  props(funPrototype, sourceToDescriptor(prototype));

  return callable as Instanceable<T>;
}
