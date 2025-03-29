import {Instanceable, Maybe, MaybeNumber} from "../../../types/core";
import {writeable} from "../../definer";
import {getDefined} from "../../objects/validators";
import {MaybeNode, Node} from "./node";
import {apply} from "../../functions/apply";
import {each} from "../each";
import {uid} from "../../polyfills/symbol";
import {WithPrototype} from "../../../types/core/objects";
import {funclass} from "../../definer/classes/";
import {descriptor2} from "../../definer/shared";
import {get, set} from "../../objects/handlers/getset";
import {FunctionClassSimpleStatics} from "../../../types/core/definer";
import {isDefined} from "../../objects/types";
import {returns} from "../../utils";


export function linkedAdd<T, N extends Node<T>>(this: LinkedList<T>, constructor: Instanceable<N, [value: T]>, value: T, index?: number) {
  const node = new constructor(value),
    $this = this;
  index = getDefined(index, returns($this.size));
  let target: MaybeNode<T> = get($this, metaHead);
  if ($this.isEmpty()) {
    set($this, metaHead, node);
    set($this, metaTail, node);
  } else if (index >= this.size)
    target = get($this, metaTail);

  return {
    target,
    index,
    node
  }
}

export function linkedPop<T>(this: LinkedList<T>, index?: number) {

  const $this = this;
  index = (isDefined(index) ? index! : $this.size - 1) - 1;

  let target: MaybeNode<T> = get($this, metaHead),
    value: Maybe<T> = null;

  if (index === -1 && this.isNotEmpty()) {
    value = target!.value();
    set($this, metaHead, target!.next());
  }

  return {
    target,
    value,
    index
  }
}

export function linkedAndNext(source: any) {
  while (source.index > 0 && source.target!.hasNext()) {
    --source.index;
    source.target = source.target!.next();
  }
}

export function linkedAddedNode<T>(this: LinkedList<T>, source: any) {
  const target = source.target,
    $this = this;
  if (target) {
    target.next(source.node, true);
    target === get($this, metaTail) && set($this, metaTail, target.next());
  }
  set($this, metaSize, $this.size + 1)
}

export function linkedRemovedNode<T>(this: LinkedList<T>, source: any) {
  const target: Node<T> = source.target,
    $this = this,
    next = target.next();

  source.value = (source.index > 0 ? next! : target).value();
  next === get($this, metaTail) && set($this, metaTail, target)
  next && target.next(next.next());
  set($this, metaSize, $this.size - 1);
}

export interface LinkedList<T> {
  get size(): number;

  isEmpty(): boolean;

  isNotEmpty(): boolean;

  clear(): void;

  forEach<R>(callback: (value: T, index: number) => void, thisArg?: R): void;

  add(value: T, index?: MaybeNumber): this;

  pop(index?: MaybeNumber): Maybe<T>;

  head(): MaybeNode<T>;

  tail(): MaybeNode<T>;
}

export interface LinkedListConstructor extends WithPrototype<LinkedList<any>> {
  new<T = any>(): LinkedList<T>;

  new<T>(values: ArrayLike<T>): LinkedList<T>;
}

const metaHead = uid("mH"),
  metaTail = uid("mT"),
  metaSize = uid("mS");


export const LinkedList: LinkedListConstructor = funclass<LinkedListConstructor>({
  construct(values) {
    const $this = this;
    writeable($this, metaHead, null);
    writeable($this, metaTail, null);
    writeable($this, metaSize, 0);
    values && each(values, $this.add, $this);
  },
  protodescriptor: {
    size: descriptor2<LinkedList<any>>(function () {
      return get(this, metaSize);
    })
  },
  prototype: <FunctionClassSimpleStatics<LinkedList<unknown>>>{
    isEmpty() {
      return this.size === 0;
    },
    isNotEmpty() {
      return !this.isEmpty();
    },
    add(value, index) {
      const $this = this,
        source = apply(linkedAdd, $this, [Node, value, index!]);

      apply(linkedAndNext, $this, [source])
      apply(linkedAddedNode, $this, [source])
      return $this;
    },
    pop(index) {
      const $this = this;
      if ($this.isEmpty())
        return null;
      const source = apply(linkedPop, $this, [index!]);
      apply(linkedAndNext, $this, [source])
      if (!source.target)
        return null;
      apply(linkedRemovedNode, $this, [source])
      return source.value;
    },
    forEach(callback, thisArg) {
      let index = 0,
        target = get(this, metaHead);

      while (target) {
        apply(callback, thisArg, [target.value(), index]);
        target = target.next();
        ++index;
      }
    },
    clear() {
      const $this = this;
      set($this, metaHead, null);
      set($this, metaTail, null);
      set($this, metaSize, 0);
    },
    head() {
      return get(this, metaHead)
    },
    tail() {
      return get(this, metaTail)
    },

  }
})
