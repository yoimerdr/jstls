import {Maybe} from "../../../types/core";
import {writeable} from "../../definer";
import {isNotEmpty} from "../../extensions/shared/iterables";
import {isDefined} from "../../objects/types";
import {apply} from "../../functions/apply";
import {uid} from "../../polyfills/symbol";
import {get, set} from "../../objects/handlers/getset";
import {WithPrototype} from "../../../types/core/objects";
import {funclass} from "../../definer/classes/funclass";
import {FunctionClassSimpleStatics} from "../../../types/core/definer";
import {nullable} from "../../utils/types";

export type MaybeNode<T> = Maybe<Node<T>>;

export function isNode(value: any): boolean {
  return value instanceof Node;
}

export function assignNextNode<T, >($this: Node<T>, args: IArguments,
                                    isNode: (value: any) => boolean,
                                    onPreserve?: (this: Node<T>, next: MaybeNode<T>) => void): MaybeNode<T> {
  if (isNotEmpty(args)) {
    let next: MaybeNode<T> = nullable;
    if (isNode(args[0])) {
      next = args[0];

      if (args[1] && $this.hasNext()) {
        set(next, metaNext, get($this, metaNext,));
        onPreserve && apply(onPreserve, $this, [next]);
      }
    }
    set($this, metaNext, next);
  }
  return get($this, metaNext);
}

const metaValue = uid("mV"),
  metaNext = uid("mN");

export interface Node<T> {
  value(): T;

  value(value: T): T;

  next(): MaybeNode<T>;

  next(next: MaybeNode<T>, preserve?: boolean): MaybeNode<T>;

  hasNext(): boolean;
}

export interface NodeConstructor extends WithPrototype<Node<any>> {
  new<T>(value: T): Node<T>;
}

/**
 * Represents a node in a singly linked structure.
 */
export const Node: NodeConstructor = funclass<NodeConstructor>({
  construct: function (value) {
    const $this = this;
    writeable($this, metaValue, value);
    writeable($this, metaNext, nullable);
  },
  prototype: <FunctionClassSimpleStatics<Node<unknown>>>{
    value(value) {
      const $this = this;
      isNotEmpty(arguments) && set($this, metaValue, value);
      return get($this, metaValue);
    },
    next() {
      return assignNextNode(this, arguments, isNode);
    },
    hasNext() {
      return isDefined(get(this, metaNext))
    }
  }
})

