import {Maybe} from "@jstls/types/core";
import {writeable} from "@jstls/core/definer";
import {isNotEmpty} from "@jstls/core/extensions/shared/iterables";
import {isDefined} from "@jstls/core/objects/types";
import {assignNextNode, Node} from "./node";
import {apply} from "@jstls/core/functions/apply";
import {WithPrototype} from "@jstls/types/core/objects";
import {uid} from "@jstls/core/polyfills/symbol";
import {funclass2} from "@jstls/core/definer/classes/funclass";
import {FunctionClassSimpleStatics} from "@jstls/types/core/definer";
import {get, set} from "@jstls/core/objects/handlers/getset";
import {nullable} from "@jstls/core/utils/types";
import {mapped} from "@jstls/core/definer/getters/builders";

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
export const BiNode: BiNodeConstructor = funclass2<BiNodeConstructor>({
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
    hasPrev: mapped(metaPrev, isDefined)
  }
}, Node)
