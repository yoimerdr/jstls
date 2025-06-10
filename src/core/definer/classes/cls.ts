import {FunctionClassConstructorFunction} from "@jstls/types/core/definer";
import {Instanceable, InstanceableParameters, InstanceableType} from "@jstls/types/core";
import {WithPrototype} from "@jstls/types/core/objects";
import {isDefined} from "@jstls/core/objects/types/fn";
import {apply} from "@jstls/core/functions/apply";
import {concat} from "@jstls/core/shortcuts/indexable";
import {indefinite} from "@jstls/core/utils/types";
import {slice} from "@jstls/core/iterable";

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
