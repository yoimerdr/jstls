import {Instanceable, InstanceableParameters, InstanceableType, Maybe, MethodKeys} from "../../../types/core";
import {reduce, slice} from "../../iterable";
import {apply} from "../../functions/apply";
import {
  FunctionClassConstructorFunction,
  FunctionClassSuper
} from "../../../types/core/definer";
import {len} from "../../shortcuts/indexable";
import {call} from "../../functions/call";
import {get} from "../../objects/handlers/getset";
import {IndeterminatePrototype, WithPrototype} from "../../../types/core/objects";


/**
 * Creates a super-like object containing parent methods that.
 * @param names Method names from the parent object to include in super
 * @param parent The parent object containing the methods
 * @returns A super object with the parent methods bound to the parent context, or undefined if no methods
 */
export function createSuper<T>(names: MethodKeys<T>[], parent: T): Maybe<FunctionClassSuper<T>> {
  if (len(names) === 0)
    return undefined!;

  return reduce(names, (supers, key) => {
    supers[key] = function () {
      const args = arguments;
      return call(get(parent, key,) as any, args[0], slice(args, 1));
    };

    return supers;
  }, <FunctionClassSuper<T>>{});
}

export function parentFirst(constructor: FunctionClassConstructorFunction<Instanceable, WithPrototype>, parent: WithPrototype): FunctionClassConstructorFunction<Instanceable, WithPrototype>;
export function parentFirst(constructor: FunctionClassConstructorFunction<Instanceable, WithPrototype>): FunctionClassConstructorFunction<Instanceable, IndeterminatePrototype>
export function parentFirst(constructor: FunctionClassConstructorFunction<Instanceable, WithPrototype>, parent?: WithPrototype) {
  return parent ? function (this: InstanceableType<Instanceable>, ...params: InstanceableParameters<Instanceable>) {
    const args: any = slice(arguments),
      $this = (parent && apply(parent as any, this, args)) || this;
    constructor && apply(constructor, $this, args);
    return $this;
  } : undefined!;
}

export function constructorFirst(constructor: FunctionClassConstructorFunction<Instanceable, WithPrototype>, parent: WithPrototype): FunctionClassConstructorFunction<Instanceable, WithPrototype>;
export function constructorFirst(constructor: FunctionClassConstructorFunction<Instanceable, IndeterminatePrototype>): FunctionClassConstructorFunction<Instanceable, IndeterminatePrototype>;
export function constructorFirst(constructor: FunctionClassConstructorFunction<Instanceable, WithPrototype>, parent?: WithPrototype) {
  return parent ? function (this: InstanceableType<Instanceable>, ...params: InstanceableParameters<Instanceable>) {
    const args: any = slice(arguments),
      $this = (constructor && apply(constructor, this, args)) || this;
    parent && apply(parent as any, $this, args);
    return $this;
  } : undefined!;
}
