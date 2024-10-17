import {Instanceable, Maybe, MaybeNumber} from "../../../types/core";
import {writeables} from "../../definer";
import {getDefined} from "../../objects/validators";
import {MaybeNode, Node} from "./node";
import {apply} from "../../functions/apply";
import {each} from "../each";


export function linkedAdd<T, N extends Node<T>>(this: LinkedList<T>, constructor: Instanceable<N, [value: T]>, value: T, index?: number) {
  const node = new constructor(value);
  index = getDefined(index, function () {
    return this.size;
  }, this);
  let target: MaybeNode<T> = this.__head__;
  if (this.isEmpty()) {
    this.__head__ = node;
    this.__tail__ = this.__head__;
  } else if (index >= this.size)
    target = this.__tail__;

  return {
    target,
    index,
    node
  }
}

export function linkedPop<T>(this: LinkedList<T>, index?: number) {
  index = getDefined(index, function () {
    return this.size - 1;
  }, this);
  let target: MaybeNode<T> = this.__head__;
  let value: Maybe<T> = null;
  if (index === 0 && this.isNotEmpty()) {
    value = this.__head__!.value();
    this.__head__ = this.__head__!.next();
  }

  return {
    target,
    value,
    index
  }
}

export function linkedAddNext(source: any) {
  while (source.index > 1 && source.target!.hasNext()) {
    --source.index;
    source.target = source.target!.next();
  }
}

export function linkedAddedNode<T>(this: LinkedList<T>, source: any) {
  if (source.target) {
    source.target.next(source.node, true);
    if (source.target === this.__tail__)
      this.__tail__ = source.target.next() as Node<T>;
  }
}

export function linkedRemovedNode<T>(this: LinkedList<T>, source: any) {
  source.value = source.target.value();
  if (source.target.next() === this.__tail__)
    this.__tail__ = source.target as any;
  source.target.next(source.target.next()!.next());
}

export class LinkedList<T = any> {
  protected __head__!: MaybeNode<T>;
  protected __tail__!: MaybeNode<T>;
  protected __size__!: number;

  constructor(values?: ArrayLike<T>) {
    writeables(this as LinkedList<T>, {
      __head__: null,
      __tail__: null,
      __size__: 0,
    });
    if (values)
      each(values, this.add, this);
  }

  get size(): number {
    return this.__size__;
  }

  isEmpty(): boolean {
    return this.__size__ === 0;
  }

  isNotEmpty(): boolean {
    return !this.isEmpty();
  }

  clear(): void {
    this.__head__ = null;
    this.__tail__ = null;
    this.__size__ = 0;
  }

  forEach<R>(callback: (value: T, index: number) => void, thisArg?: R): void {
    let index = 0;
    let target = this.__head__;
    while (target) {
      apply(callback, thisArg!, [target.value(), index]);
      target = target.next();
      ++index;
    }
  }

  add(value: T, index?: MaybeNumber): this {
    const source = apply(linkedAdd, this, [Node, value, index!]);
    apply(linkedAddNext, this, [source])
    apply(linkedAddedNode, this, [source])
    this.__size__++;
    return this;
  }

  pop(index?: MaybeNumber): Maybe<T> {
    if (this.isEmpty())
      return null;
    const source = apply(linkedPop, this, [index!]);
    apply(linkedAddNext, this, [source])
    if(!source.target)
      return null;
    apply(linkedRemovedNode, this, [source])
    --this.__size__;
    return source.value as T;
  }

}
