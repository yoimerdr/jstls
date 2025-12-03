import {FunctionClassConstructorFunction} from "@jstls/types/core/definer";
import {Instanceable, InstanceableParameters, InstanceableType} from "@jstls/types/core";
import {WithPrototype} from "@jstls/types/core/objects";
import {isDefined} from "@jstls/core/objects/types/fn";
import {apply} from "@jstls/core/functions/apply";
import {concat} from "@jstls/core/shortcuts/indexable";
import {indefinite} from "@jstls/core/utils/types";
import {slice} from "@jstls/core/iterable";

/**
 * Creates a class constructor that executes the parent constructor before the child constructor.
 * Supports instantiation without the `new` keyword.
 *
 * @example
 * const Parent = function() { this.p = 1; };
 * const Child = functionConstructor(function() { this.c = 2; }, Parent);
 * const instance = Child(); // Works without `new`
 * console.log(instance); // { p: 1, c: 2 }
 *
 * @param constructor The child constructor.
 * @param parent The parent constructor.
 */
export function functionConstructor(constructor: FunctionClassConstructorFunction<Instanceable, WithPrototype>, parent?: WithPrototype): (this: InstanceableType<Instanceable>, ...params: InstanceableParameters<Instanceable>) => any {
  return function FunClass(this: InstanceableType<Instanceable>,): any {
    const args = slice(arguments);
    if (!isDefined(this)) {
      return new (apply(FunClass.bind as any as Instanceable, FunClass, concat([indefinite], args)))()
    } else {
      const $this = (parent && apply(parent as Instanceable, this, args)) || this;
      apply(constructor, $this, args);
      return $this;
    }
  };
}

/**
 * Creates a class constructor that executes the child constructor before the parent constructor.
 * Supports instantiation without the `new` keyword.
 *
 * @example
 * const Parent = function() { this.p = 1; };
 * const Child = functionParent(function() { this.c = 2; }, Parent);
 * const instance = Child(); // Works without `new`
 * console.log(instance); // { c: 2, p: 1 }
 *
 * @param constructor The child constructor.
 * @param parent The parent constructor.
 */
export function functionParent(constructor: FunctionClassConstructorFunction<Instanceable, WithPrototype>, parent?: WithPrototype): (this: InstanceableType<Instanceable>, ...params: InstanceableParameters<Instanceable>) => any {
  return function FunClass(this: InstanceableType<Instanceable>,): any {
    const args = slice(arguments);
    if (!isDefined(this)) {
      return new (apply(FunClass.bind as any as Instanceable, FunClass, concat([indefinite], args)))()
    } else {
      const $this = apply(constructor, this, args) || this;
      parent && apply(parent as Instanceable, $this, args);
      return $this;
    }
  };
}
