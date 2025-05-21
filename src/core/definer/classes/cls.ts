import {FunctionClassConstructorFunction} from "@/types/core/definer";
import {Instanceable, InstanceableParameters, InstanceableType} from "@/types/core";
import {WithPrototype} from "@/types/core/objects";
import {isDefined} from "@/core/objects/types";
import {apply} from "@/core/functions/apply";
import {concat} from "@/core/shortcuts/indexable";
import {indefinite} from "@/core/utils/types";
import {slice} from "@/core/iterable";

export function functionConstructor(constructor: FunctionClassConstructorFunction<Instanceable, WithPrototype>, parent?: WithPrototype) {
  return function FunClass(this: InstanceableType<Instanceable>, ...params: InstanceableParameters<Instanceable>): any {
    const args = slice(arguments);
    if (!isDefined(this)) {
      return new (apply(FunClass.bind, FunClass, concat([indefinite], args)))()
    } else {
      const $this = (parent && apply(parent as any, this, args)) || this;
      apply(constructor, $this, args);
      return $this;
    }
  };
}

export function functionParent(constructor: FunctionClassConstructorFunction<Instanceable, WithPrototype>, parent?: WithPrototype) {
  return function FunClass(this: InstanceableType<Instanceable>, ...params: InstanceableParameters<Instanceable>): any {
    const args = slice(arguments);
    if (!isDefined(this)) {
      return new (apply(FunClass.bind, FunClass, concat([indefinite], args)))()
    } else {
      const $this = apply(constructor, this, args) || this;
      parent && apply(parent as any, $this, args);
      return $this;
    }
  };
}
