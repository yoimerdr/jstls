import {ArrayLike, ArrayLikeEach, ArrayLikeType} from "@/types/core/array";
import {protoapply} from "@/core/functions/prototype/apply";

export function filter<T, A extends ArrayLike<T> = ArrayLike<T>, R = void>(source: A, predicate: ArrayLikeEach<T, R, A, boolean>, thisArg?: R): ArrayLikeType<A>[];
export function filter<T, R = void>(source: ArrayLike<T>, predicate: ArrayLikeEach<T, R, ArrayLike<T>, boolean>, thisArg?: R): ArrayLikeType<ArrayLike<T>>[];
export function filter<T extends any, R = void>(source: ArrayLike<T>, predicate: ArrayLikeEach<T, R, ArrayLike<T>, unknown>, thisArg?: R): T[] {
  return protoapply(Array<any>, "filter", source, [predicate, thisArg]);
}

