import {linkedAdd, linkedAddedNode, linkedAndNext, LinkedList, linkedPop, linkedRemovedNode} from "./list";
import {BiNode, MaybeBiNode} from "./bi-node";
import {round} from "@jstls/core/shortcuts/math";
import {WithPrototype} from "@jstls/types/core/objects";
import {funclass2} from "@jstls/core/definer/classes/funclass";
import {FunctionClassSimpleStatics} from "@jstls/types/core/definer";
import {nullable} from "@jstls/core/utils/types";

function linkedAddPrev<T>($this: BiLinkedList<T>, source: any) {
  source.index = $this.size - source.index + 1;
  source.target = $this.tail();
  const target = source.target;
  while (source.index > 1 && target.hasPrev()) {
    source.target = target.prev()
    source.index--;
  }
}

function linkedNode<T>($this: BiLinkedList<T>, source: any) {
  if (source.target !== $this.tail()) {
    const mid = round($this.size / 2);
    if (source.index > mid)
      linkedAddPrev($this, source)
    else linkedAndNext(source);
  }
}

export interface BiLinkedList<T> extends LinkedList<T> {
  tail(): MaybeBiNode<T>;

  head(): MaybeBiNode<T>;
}

export interface BiLinkedListConstructor extends WithPrototype<BiLinkedList<any>> {
  new<T = any>(): BiLinkedList<T>;

  new<T>(values: ArrayLike<T>): BiLinkedList<T>;
}

export const BiLinkedList: BiLinkedListConstructor = funclass2({
  prototype: <FunctionClassSimpleStatics<BiLinkedList<unknown>>>{
    add(value, index) {
      const $this = this,
        source = linkedAdd($this, BiNode, value, index!),
        target = source.target as MaybeBiNode<unknown>;

      linkedNode($this, source)
      linkedAddedNode($this, source);

      if (target && target.next() === $this.tail())
        $this.tail()!.prev(target);
      return $this;
    },
    pop(index) {
      if (this.isEmpty())
        return nullable;
      const $this = this,
        source = linkedPop($this, index!),
        target = source.target as MaybeBiNode<any>;

      linkedNode($this, source);
      if (!target)
        return nullable;

      linkedRemovedNode($this, source);

      target.hasNext() && target.next()!.prev(target)
      return source.value;
    }
  }
}, LinkedList)
