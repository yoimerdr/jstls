import {MethodKeys, SafeParameters, SafeReturnType} from "../../types/core";
import {ExtendMethodBuilder, ExtendMethodBuilders} from "../../types/core/objects/extender";
import {multiple} from "../definer/shared";
import {requiredWithType, requireFunction} from "../objects/validators";
import {apply} from "../utils/functions";
import {slice} from "../iterable";

/**
 * Extends a method to add additional functionality.
 * @param target The target value.
 * @param key The object key. The value of that property must be a function.
 * @param builder The builder with the options to extend.
 */
export function method<T extends Object, K extends MethodKeys<T>>(target: T, key: K, builder: ExtendMethodBuilder<T, K>): void;
export function method<T extends Object, K extends MethodKeys<T>>(target: T, key: K, builder: ExtendMethodBuilder<T, K>): void {
  builder = requiredWithType(builder, "object", "builder");
  if (["replace", "modifyParameters", "beforeCall", "afterCall"].some(Object.prototype.hasOwnProperty, builder)) {
    const met = target[key];
    requireFunction(met, 'extend method');
    target[key] = function (this: T): SafeReturnType<T[K]> {
      let args: SafeParameters<T[K]> = slice(arguments) as any;
      if (builder.replace)
        return apply(builder.replace, this, <any>[met].concat(args))
      if (builder.modifyParameters)
        args = apply(builder.modifyParameters, this, args)
      if (builder.beforeCall)
        apply(builder.beforeCall, this, args)

      let res = apply(met as any, this, args)
      if (!builder.afterCall)
        return res

      return apply(builder.afterCall, this, <any>[res].concat(args))
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
  multiple(target, descriptors, <any>method)
}

