import {Instanceable, InstanceableType, Join, JoinInstanceableTypes,} from "../index";

export interface MixinOptions<T extends Instanceable[]> {
  /**
   * If true, if any value already exists for any property name in target, it will be replaced.
   * by the value of the last base with that property name.
   */
  force?: boolean;
  /**
   * If true, it also mixes the static property names.  Default true.
   */
  statics?: boolean;
  /**
   * Other classes references (or objects with a `prototype` object).
   */
  bases: T;
}

export type MixinProperties<C extends Instanceable, T extends Instanceable[]> =
  InstanceableType<C>
  & JoinInstanceableTypes<T>;
export type MixinStatics<C extends Instanceable, T extends Instanceable[]> = C & Join<T>;
