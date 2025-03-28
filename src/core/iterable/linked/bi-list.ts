import {linkedAdd, linkedAddedNode, linkedAndNext, LinkedList, linkedPop, linkedRemovedNode} from "./list";
import {BiNode, MaybeBiNode} from "./bi-node";
import {apply} from "../../functions/apply";
import {round} from "../../shortcuts/math";
import {WithPrototype} from "../../../types/core/objects";
import {funclass} from "../../definer/classes/";
import {FunctionClassSimpleStatics} from "../../../types/core/definer";

function linkedAddPrev<T>(this: BiLinkedList<T>, source: any) {
  const $this = this;
  source.index = $this.size - source.index + 1;
  source.target = $this.tail();
  const target = source.target;
  while (source.index > 1 && target.hasPrev()) {
    source.target = target.prev()
    source.index--;
  }
}

function linkedNode<T>(this: BiLinkedList<T>, source: any) {
  const $this = this;
  if (source.target !== $this.tail()) {
    const mid = round($this.size / 2);
    if (source.index > mid)
      apply(linkedAddPrev, $this, [source])
    else apply(linkedAndNext, $this, [source]);
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

export const BiLinkedList: BiLinkedListConstructor = funclass<BiLinkedListConstructor>({
  prototype: <FunctionClassSimpleStatics<BiLinkedList<unknown>>>{
    add(value, index) {
      const $this = this,
        source = apply(linkedAdd, $this, [BiNode, value, index!]),
        target = source.target as MaybeBiNode<unknown>;

      apply(linkedNode, $this, [source])
      apply(linkedAddedNode, $this, [source]);

      if (target && target.next() === $this.tail())
        $this.tail()!.prev(target);
      return $this;
    },
    pop(index) {
      if (this.isEmpty())
        return null;
      const $this = this,
        source = apply(linkedPop, $this, [index!]),
        target = source.target as MaybeBiNode<any>;

      apply(linkedNode, $this, [source]);
      if (!target)
        return null;

      apply(linkedRemovedNode, $this, [source]);

      target.hasNext() && target.next()!.prev(target)
      return source.value;
    }
  }
}, LinkedList)
