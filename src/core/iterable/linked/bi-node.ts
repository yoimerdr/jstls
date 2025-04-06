import {Maybe} from "../../../types/core";
import {writeable} from "../../definer";
import {isNotEmpty} from "../../extensions/shared/iterables";
import {isDefined} from "../../objects/types";
import {assignNextNode, Node} from "./node";
import {apply} from "../../functions/apply";
import {WithPrototype} from "../../../types/core/objects";
import {uid} from "../../polyfills/symbol";
import {funclass} from "../../definer/classes//funclass";
import {FunctionClassSimpleStatics} from "../../../types/core/definer";
import {get, set} from "../../objects/handlers/getset";
import {nullable} from "../../utils/types";

export type MaybeBiNode<T> = Maybe<BiNode<T>>;

export function isBiNode(value: any): boolean {
  return value instanceof BiNode;
}

function assignPrevNode<T>($this: BiNode<T>, args: IArguments,
                           isBiNode: (value: any) => boolean,
                           onPreserve?: (this: BiNode<T>, prev: BiNode<T>) => void): MaybeBiNode<T> {
  if (isNotEmpty(args)) {
    let prev: MaybeBiNode<T> = nullable;
    if (isBiNode(args[0])) {
      prev = args[0];
      if (args[1] && $this.hasPrev()) {
        set(prev, metaPrev, get($this, metaPrev,));
        onPreserve && apply(onPreserve, $this, [prev!])
      }
    }
    set($this, metaPrev, prev);
  }

  return get($this, metaPrev);
}

export interface BiNode<T> extends Node<T> {
  next(): MaybeBiNode<T>;

  next(next: MaybeBiNode<T>, preserve?: boolean): MaybeBiNode<T>;

  prev(): MaybeBiNode<T>;

  prev(prev: MaybeBiNode<T>, preserve?: boolean): MaybeBiNode<T>;

  hasPrev(): boolean;
}

export interface BiNodeConstructor extends WithPrototype<BiNode<any>> {
  new<T>(value: T): BiNode<T>;
}

const metaPrev = uid('mP');

/**
 * Represents a node in a doubly linked structure.
 */
export const BiNode: BiNodeConstructor = funclass<BiNodeConstructor>({
  construct: function () {
    writeable(this, metaPrev, nullable);
  },
  prototype: <FunctionClassSimpleStatics<BiNode<unknown>>>{
    next() {
      return assignNextNode(this, arguments, isBiNode, function (next) {
        const $this = this as BiNode<any>;
        $this.hasNext() && set($this.next(), metaPrev, next)
        set(next, metaPrev, $this)
      })
    },
    prev() {
      return assignPrevNode(this, arguments, isBiNode, function (prev) {
        const $this = this;
        $this.hasPrev() && get($this, metaPrev).next(prev);
        prev.next($this)
      });
    },
    hasPrev: function () {
      return isDefined(get(this, metaPrev));
    }
  }
}, Node)
