import {Instanceable, InstanceableType, Maybe, MethodKeys} from "@jstls/types/core";
import {reduce, slice} from "@jstls/core/iterable";
import {apply} from "@jstls/core/functions/apply";
import {FunctionClassConstructorFunction, FunctionClassSuper} from "@jstls/types/core/definer";
import {len} from "@jstls/core/shortcuts/indexable";
import {call} from "@jstls/core/functions/call";
import {IndeterminatePrototype, WithPrototype} from "@jstls/types/core/objects";
import {indefinite} from "@jstls/core/utils/types";


/**
 * Creates a super-like object containing parent methods.
 *
 * @example
 * const parent = { foo: () => 'bar' };
 * const sup = createSuper(['foo'], parent);
 * sup.foo(); // 'bar'
 *
 * @param names Method names from the parent object to include in super
 * @param parent The parent object containing the methods
 */
export function createSuper<T>(names: MethodKeys<T>[], parent: T): Maybe<FunctionClassSuper<T>> {
  if (len(names) === 0)
    return indefinite!;

  return reduce(names, (supers, key) => {
    supers[key] = function () {
      const args = arguments;
      return call(parent[key] as any, args[0], slice(args, 1));
    };

    return supers;
  }, <FunctionClassSuper<T>>{});
}

/**
 * Wraps a constructor to ensure the parent constructor is called first.
 *
 * @example
 * // Default behavior in funclass
 * const Parent = function() { this.p = 1; };
 * const Child = parentFirst(function() { this.c = 2; }, Parent);
 * new Child(); // { p: 1, c: 2 }
 *
 * @param constructor The child constructor.
 * @param parent The parent constructor.
 */
export function parentFirst(constructor: FunctionClassConstructorFunction<Instanceable, WithPrototype>, parent: WithPrototype): FunctionClassConstructorFunction<Instanceable, WithPrototype>;
/**
 * Wraps a constructor to ensure the parent constructor is called first.
 *
 * @example
 * const Child = parentFirst(function() { this.c = 2; });
 * new Child(); // { c: 2 }
 *
 * @param constructor The child constructor.
 */
export function parentFirst(constructor: FunctionClassConstructorFunction<Instanceable, WithPrototype>): FunctionClassConstructorFunction<Instanceable, IndeterminatePrototype>
export function parentFirst(constructor: FunctionClassConstructorFunction<Instanceable, WithPrototype>, parent?: WithPrototype) {
  return parent ? function Instanceable(this: InstanceableType<Instanceable>) {
    const args: any = slice(arguments),
      $this = (parent && apply(parent as any, this, args)) || this;
    constructor && apply(constructor, $this, args);
    return $this;
  } : indefinite!;
}

/**
 * Wraps a constructor to ensure the child constructor is called first.
 *
 * @example
 * // Can be used as a custom clsBuilder in funclass
 * const Parent = function() { this.p = 1; };
 * const Child = constructorFirst(function() { this.c = 2; }, Parent);
 * new Child(); // { c: 2, p: 1 }
 *
 * @param constructor The child constructor.
 * @param parent The parent constructor.
 */
export function constructorFirst(constructor: FunctionClassConstructorFunction<Instanceable, WithPrototype>, parent: WithPrototype): FunctionClassConstructorFunction<Instanceable, WithPrototype>;
/**
 * Wraps a constructor to ensure the child constructor is called first.
 *
 * @example
 * const Child = constructorFirst(function() { this.c = 2; });
 * new Child(); // { c: 2 }
 *
 * @param constructor The child constructor.
 */
export function constructorFirst(constructor: FunctionClassConstructorFunction<Instanceable>): FunctionClassConstructorFunction<Instanceable, IndeterminatePrototype>;
export function constructorFirst(constructor: FunctionClassConstructorFunction<Instanceable, WithPrototype>, parent?: WithPrototype) {
  return parent ? function Instanceable(this: InstanceableType<Instanceable>) {
    const args: any = slice(arguments),
      $this = (constructor && apply(constructor, this, args)) || this;
    parent && apply(parent as any, $this, args);
    return $this;
  } : indefinite!;
}
