import {Instanceable, JoinInstanceableTypes} from "../../../types/core";
import {KeyableObject} from "../../../types/core/objects";

export * from "./mixin";
export * from "./mixer";

type MixinConstructor = {
  new<T extends Instanceable[]>(...args: any[]): JoinInstanceableTypes<T>;
  mix<I extends Instanceable[], T extends typeof Mixin<I>>(this: T, bases: I, statics?: boolean, force?: boolean): void;
} & KeyableObject;

export declare const Mixin: MixinConstructor;
