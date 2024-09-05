import {Maybe} from "../../../types/core";
import {writeables} from "../../definer";
import {isNotEmpty} from "../../extensions/shared/iterables";
import {isDefined} from "../../objects/types";
import {apply} from "../../utils/functions";
import {assignNextNode, Node} from "./node";

export type MaybeBiNode<T> = Maybe<BiNode<T>>;

export function isBiNode(value: any): boolean {
  return value instanceof BiNode;
}

function assignPrevNode<T>(this: BiNode<T>, args: IArguments,
                           isBiNode: (value: any) => boolean,
                           onPreserve?: (this: BiNode<T>, prev: BiNode<T>) => void): MaybeBiNode<T> {
  if (apply(isNotEmpty, args)) {
    let prev: MaybeBiNode<T> = null;
    if (isBiNode(args[0])) {
      prev = args[0];
      if (args[1] && this.hasPrev()) {
        prev!.__prev__ = this.__prev__;
        if (onPreserve)
          apply(onPreserve, this, [prev!])
      }
    }
    this.__prev__ = prev;
  }
  return this.__prev__;
}

/**
 * Represents a node in a doubly linked structure.
 */
export class BiNode<T> extends Node<T> {
  protected __next__: MaybeBiNode<T>;
  protected __prev__: MaybeBiNode<T>;

  constructor(value: T) {
    super(value);
    writeables(this as BiNode<T>, {
      __prev__: null,
    })
  }

  next(next?: MaybeBiNode<T>, preserve?: boolean): MaybeBiNode<T> {
    return apply(assignNextNode, this, [arguments, isBiNode, <any>function (this: BiNode<T>, next: BiNode<T>) {
      if (this.hasNext())
        this.__next__!.__prev__ = next;

      next.__prev__ = this;
    }]) as MaybeBiNode<T>;
  }

  prev(prev?: MaybeBiNode<T>, preserve?: boolean): MaybeBiNode<T> {
    return apply(assignPrevNode, this, [arguments, isBiNode, function (this, prev) {
      if(this.hasPrev())
        this.__prev__!.__next__ = prev
      prev.__next__ = this;
    }]) as MaybeBiNode<T>;
  }

  hasPrev(): boolean {
    return isDefined(this.__prev__);
  }
}
