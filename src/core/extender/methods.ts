import {MethodKeys, SafeParameters, SafeReturnType} from "@jstls/types/core";
import {ExtendMethodBuilder, ExtendMethodBuilders} from "@jstls/types/core/objects/extender";
import {multiple} from "@jstls/core/definer/shared";
import {requiredWithType, requireFunction} from "@jstls/core/objects/validators";
import {slice} from "@jstls/core/iterable";
import {apply} from "@jstls/core/functions/apply";
import {concat} from "@jstls/core/shortcuts/indexable";

/**
 * Extends a method to add additional functionality.
 * @example
 * var source = {
 *   say(name: string) {
 *     console.log("Hello, " + name + "!")
 *   }
 * }
 *
 * method(source, "say", {
 *   afterCall(result, name) {
 *     console.log("After", name)
 *   },
 *   beforeCall(name) {
 *     console.log("Before", name)
 *   },
 *   modifyParameters(name): [name: string] {
 *     return ["What"]
 *   }
 * })
 *
 * method(source, "say", {
 *   afterCall(result, name) {
 *     console.log("After2", name)
 *   },
 *   beforeCall(name) {
 *     console.log("Before2", name)
 *   },
 * })
 *
 * // The next call will log
 * // Before2 Sample
 * // Before What
 * // Hello, What!
 * // After What
 * // After2 Sample
 * source.say("Sample")
 *
 * @param target The target value.
 * @param key The object key. The value of that property must be a function.
 * @param builder The builder with the options to extend.
 */
export function method<T extends Object, K extends MethodKeys<T>>(target: T, key: K, builder: ExtendMethodBuilder<T, K>): void;
export function method<T extends Object, K extends MethodKeys<T>>(target: T, key: K, builder: ExtendMethodBuilder<T, K>): void {
  builder = requiredWithType(builder, "object", "builder");
  if (["replace", "modifyParameters", "beforeCall", "afterCall"].some(Object.prototype.hasOwnProperty, builder)) {
    const met: any = target[key];
    requireFunction(met, 'extend method');
    const {replace, modifyParameters, beforeCall, afterCall} = builder;
    target[key] = function (this: T): SafeReturnType<T[K]> {
      let args: SafeParameters<T[K]> = slice(arguments) as any,
        $this = this;
      if (replace)
        return apply(replace, $this, concat([met], args));

      modifyParameters && (args = apply(modifyParameters, $this, args))
      beforeCall && apply(beforeCall, $this, args)

      let res = apply(met, $this, args)
      if (!afterCall)
        return res

      return apply(afterCall, $this, concat([res], args))
    } as T[K]
  }
}

/**
 * Extends methods to add additional functionality.
 * @param target The target value.
 * @param descriptors The object keys and their builder extends options.
 * @see {method}
 */
export function methods<T extends Object>(target: T, descriptors: ExtendMethodBuilders<T>) {
  multiple(target, descriptors, method)
}

