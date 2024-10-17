import {Mutable} from "../index";

export type SingletonInit<T> = (this: Mutable<T>, instance: Mutable<T>) => void
