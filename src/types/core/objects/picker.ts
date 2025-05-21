import {Entry, Keys} from "@jstls/types/core";
import {ArrayOr, ArraySelect} from "@jstls/types/core/array";
import {KeyableObject} from "./index";

export type PickProperty<T> = {
  [P in Keys<T>]?: boolean | Keys<T[P]> | Keys<T[P]>[] | PickProperty<T[P]> | PickPropertyBuilder<T, P, KeyableObject> | PickPropertyBuilder<T, P, KeyableObject>[];
};

export type PickPropertyBuilder<T, P extends Keys<T>, R> = T extends any[] ? {
  value: PickProperty<T>;
} : {
  builder?: (this: R, value: T[P], object: T, key: Keys<T>) => R;
  value?: PickProperty<T[P]>
};

export type PickTransformProperty<T> =
  {
    [P in Keys<T>]?: PropertyKey | Entry<PropertyKey, PickTransformProperty<ArrayOr<T[P], ArraySelect<T[P], 0>, T[P]>>> | boolean
  }
  | Record<PropertyKey, PropertyKey | Entry<PropertyKey, PickTransformProperty<ArrayOr<any, ArraySelect<any, 0>, any>>> | boolean>
