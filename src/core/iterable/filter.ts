import {ArrayLike, ArrayLikeEach, ArrayLikeType} from "@jstls/types/core/array";
import {binds} from "@jstls/core/functions/bind";
import {prototype} from "@jstls/core/shortcuts/object";

export const filter = binds(prototype(Array).filter) as {
  <T, A extends ArrayLike<T> = ArrayLike<T>, R = void>(source: A, predicate: ArrayLikeEach<T, R, A, boolean>, thisArg?: R): ArrayLikeType<A>[];
  <T, R = void>(source: ArrayLike<T>, predicate: ArrayLikeEach<T, R, ArrayLike<T>, boolean>, thisArg?: R): ArrayLikeType<ArrayLike<T>>[];
}

