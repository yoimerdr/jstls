import {Maybe} from "../../../types/core";
import {writeables} from "../../definer";
import {isNotEmpty} from "../../extensions/shared/iterables";
import {isDefined} from "../../objects/types";
import {apply} from "../../utils/functions";

export type MaybeNode<T> = Maybe<Node<T>>;

export function isNode(value: any): boolean {
  return value instanceof Node;
}

export function assignNextNode<T, >(this: Node<T>, args: IArguments,
                                  isNode: (value: any) => boolean,
                                  onPreserve?: (this: Node<T>, next: MaybeNode<T>) => void): MaybeNode<T> {
  if(apply(isNotEmpty, args)) {
    let next: MaybeNode<T> = null;
    if(isNode(args[0])) {
      next = args[0];

      if(args[1] && this.hasNext()) {
        next!.__next__ = this.__next__;
        if(onPreserve)
          apply(onPreserve, this, [next]);
      }
    }
    this.__next__ = next;
  }
  return this.__next__;
}

/**
 * Represents a node in a singly linked structure.
 */
export class Node<T> {
  protected __value__!: T;
  protected __next__!: MaybeNode<T>;

  constructor(value: T) {
    writeables(this as Node<T>, {
      __value__: value,
      __next__: null,
    })
  }

  value(value?: T): T {
    if(apply(isNotEmpty, arguments))
      this.__value__ = value!;
    return this.__value__;
  }

  next(next?: MaybeNode<T>, preserve?: boolean): MaybeNode<T> {
    return apply(assignNextNode, this, [arguments, isNode]) as MaybeNode<T>;
  }

  hasNext() {
    return isDefined(this.__next__);
  }
}

