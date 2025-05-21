import {Instanceable, Maybe, MaybeNumber} from "@/types/core";
import {writeable} from "@/core/definer";
import {getDefined} from "@/core/objects/validators";
import {MaybeNode, Node} from "./node";
import {apply} from "@/core/functions/apply";
import {each} from "../each";
import {uid} from "@/core/polyfills/symbol";
import {WithPrototype} from "@/types/core/objects";
import {funclass2} from "@/core/definer/classes/funclass";
import {descriptor2} from "@/core/definer/shared";
import {get, set} from "@/core/objects/handlers/getset";
import {FunctionClassSimpleStatics} from "@/types/core/definer";
import {isDefined} from "@/core/objects/types";
import {returns} from "@/core/utils";
import {nullable} from "@/core/utils/types";
import {simple} from "@/core/definer/getters/builders";


export function linkedAdd<T, N extends Node<T>>($this: LinkedList<T>, constructor: Instanceable<N, [value: T]>, value: T, index?: number) {
  const node = new constructor(value);
  index = getDefined(index, returns($this.size));
  let target: MaybeNode<T> = get($this, metaHead);
  if ($this.isEmpty()) {
    set($this, metaHead, node);
    set($this, metaTail, node);
  } else if (index >= $this.size)
    target = get($this, metaTail);

  return {
    target,
    index,
    node
  }
}

export function linkedPop<T>($this: LinkedList<T>, index?: number) {

  index = (isDefined(index) ? index! : $this.size - 1) - 1;

  let target: MaybeNode<T> = get($this, metaHead),
    value: Maybe<T> = nullable;

  if (index === -1 && $this.isNotEmpty()) {
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

export function linkedAddedNode<T>($this: LinkedList<T>, source: any) {
  const target = source.target;
  if (target) {
    target.next(source.node, true);
    target === get($this, metaTail) && set($this, metaTail, target.next());
  }
  set($this, metaSize, $this.size + 1)
}

export function linkedRemovedNode<T>($this: LinkedList<T>, source: any) {
  const target: Node<T> = source.target,
    next = target.next();

  source.value = (source.index > 0 ? next! : target).value();
  next === get($this, metaTail) && set($this, metaTail, target)
  next && target.next(next.next());
  set($this, metaSize, $this.size - 1);
}

export interface LinkedList<T> {
  readonly size: number;

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


export const LinkedList: LinkedListConstructor = funclass2({
  construct: function (values) {
    const $this = this;
    writeable($this, metaHead, nullable);
    writeable($this, metaTail, nullable);
    writeable($this, metaSize, 0);
    values && each(values, $this.add, $this);
  },
  protodescriptor: {
    size: descriptor2(simple(metaSize))
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
        source = linkedAdd($this, Node, value, index!);

      linkedAndNext(source)
      linkedAddedNode($this, source)
      return $this;
    },
    pop(index) {
      const $this = this;
      if ($this.isEmpty())
        return nullable;
      const source = linkedPop($this, index!);
      linkedAndNext(source)
      if (!source.target)
        return nullable;
      linkedRemovedNode($this, source)
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
      set($this, metaHead, nullable);
      set($this, metaTail, nullable);
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
