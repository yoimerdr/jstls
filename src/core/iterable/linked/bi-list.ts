import {linkedAdd, linkedAddedNode, linkedAddNext, LinkedList, linkedPop, linkedRemovedNode} from "./list";
import {BiNode, MaybeBiNode} from "./bi-node";
import {Maybe, MaybeNumber} from "../../../types/core";
import {apply} from "../../functions/apply";
import {round} from "../../shortcuts/math";

function linkedAddPrev<T>(this: BiLinkedList<T>, source: any) {
  source.index = this.size - source.index + 1;
  source.target = this.__tail__;
  while (source.index > 1 && (source.target as BiNode<T>).hasPrev()) {
    source.target = (source.target as BiNode<T>).prev()
    source.index--;
  }
}

function linkedNode<T>(this: BiLinkedList<T>, source: any) {
  if (source.target !== this.__tail__) {
    const mid = round(this.size / 2);
    if (source.index > mid)
      apply(linkedAddPrev, this, [source])
    else apply(linkedAddNext, this, [source]);
  }
}

export class BiLinkedList<T = any> extends LinkedList<T> {
  protected __tail__!: MaybeBiNode<T>;
  protected __head__!: MaybeBiNode<T>;


  add(value: T, index?: MaybeNumber): this {
    const source = apply(linkedAdd, this, [BiNode, value, index!]);
    apply(linkedNode, this, [source])
    apply(linkedAddedNode, this, [source]);
    if (source.target && source.target.next() === this.__tail__)
      this.__tail__!.prev(source.target as BiNode<T>);
    ++this.__size__;
    return this;
  }

  pop(index?: MaybeNumber): Maybe<T> {
    if(this.isEmpty())
      return null;
    const source = apply(linkedPop, this, [index!]);
    apply(linkedNode, this, [source]);
    if(!source.target)
      return null;
    apply(linkedRemovedNode, this, [source]);
    if(source.target && source.target.hasNext())
      (source.target.next() as BiNode<T>).prev(source.target as BiNode<T>)
    --this.__size__;
    return source.value as T;
  }
}
