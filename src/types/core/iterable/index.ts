import {ArrayLike} from "../array";

export type IterEach<V, T = void, R = void> = (this: T, item: V, index: number) => R;
export type IterEachNext<V, T = void, R = void> = (this: T, item: V, next: V, index: number) => R;
export type IterEachPrevious<V, T = void, R = void> = (this: T, item: V, previous: V, index: number) => R;
export type IterMatchCondition<V> = IterEach<V, void, boolean>;
export type IterMap<V, R, T = void> = IterEach<V,  T, R>;

export interface Foreachable<T> {
  forEach<R>(callback: (value: T) => void, thisArg?: R): void;
}

export type ForeachableType<S> = S extends Foreachable<infer T> ? T : void;

export type ForeachableEach<V, T, I extends Foreachable<V> = Foreachable<V>, R = void> = (this: T, value: ForeachableType<I>, index: number, iterable: I) => R;

export type IterableLike<T> = (ArrayLike<T> | Foreachable<T>) & Object;

export type IterableLikeEach<V, T, I extends IterableLike<V> = IterableLike<V>, R = void> = (this: T, value: V, index: number, iterable: I) => R;
