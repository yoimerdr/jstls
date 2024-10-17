import {Extends, Keys} from "./index";
import {Indexable, WithLength} from "./objects";

export type ArrayEach<V, T, R = void> = (this: T, value: V, index: number, array: V[]) => R;

export type ArraySelect<T, Index extends number> = T extends Array<any> ? (Index extends Keys<T> ? T[Index] : never) : never

export type ArrayOr<T, If = any[], Not = any> = Extends<T, any[], If, Not>;

export type ArrayLikeType<A> = A extends ArrayLike<infer T> ? T : unknown;

export type ArrayLikeEach<V, T, A extends ArrayLike<V> = ArrayLike<V>, R = void> = (this: T, value: ArrayLikeType<A>, index: number, iterable: A) => R;
export type ArrayLikeEachNext<V, T, A extends ArrayLike<V> = ArrayLike<V>, R = void> = (this: T, value: ArrayLikeType<A>, next: ArrayLikeType<A>, index: number, iterable: A) => R;
export type ArrayLikeEachPrevious<V, T, A extends ArrayLike<V> = ArrayLike<V>, R = void> = (this: T, value: ArrayLikeType<A>, previous: ArrayLikeType<A>, index: number, iterable: A) => R;

export type ArrayLike<T = any> = WithLength & Indexable<T>;
export type ArrayLikeReduce<T, A extends ArrayLike<T> = ArrayLike<T>, U = ArrayLikeType<A>> = (previousValue: U, currentValue: ArrayLikeType<A>, currentIndex: number, array: A) => U;


declare global {
  interface Array<T> {
    forEach<This>(callbackfn: ArrayEach<T, This> & ThisType<This>, thisArg?: This): void;

    map<U, This>(callbackfn: ArrayEach<T, This, U> & ThisType<This>, thisArg?: This): U[];
  }
}

