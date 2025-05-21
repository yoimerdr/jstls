import {Mutable} from "@jstls/types/core";

export type SingletonInit<T> = (this: Mutable<T>, instance: Mutable<T>) => void
