import {Instanceable, JoinInstanceableTypes,} from "../../../types/core";
import {MixinOptions} from "../../../types/core/wrappers/mixin";
import {readonly} from "../../definer";
import {uid} from "../../polyfills/symbol";
import {commonPrototype, commonStatics, propertyNames} from "../../objects/handlers/properties";
import {isDefined, isPlainObject} from "../../objects/types";
import {KeyableObject, WithPrototype} from "../../../types/core/objects";
import {isEmpty} from "../../extensions/shared/iterables";
import {IllegalAccessError, RequiredArgumentError} from "../../exceptions";
import {hasOwn} from "../../polyfills/objects/es2022";
import {is} from "../../polyfills/objects/es2015";
import {get} from "../../objects/handlers/getset";
import {forEach} from "../../shortcuts/array";
import {includes} from "../../polyfills/indexable/es2016";
import {call} from "../../functions/call";
import {funclass} from "../../definer/classes";


const mixinKey = uid("mC");

export function getMixinBases(instance: Object) {
  return get(instance.constructor, mixinKey);
}

/**
 * The mixin decorator.
 *
 * Mixin the properties names from bases prototypes to the target class property.
 * @param bases Other classes references (or objects with a `prototype` object).
 * @see {mixer}
 * @see {mixerSuper}
 * @see {mixerInit}
 */
export function mixin<T extends Instanceable[]>(bases: T): Function;
/**
 * The mixin decorator.
 *
 * Mixin the properties names from bases prototypes to the target class property.
 * @param options The mixin options.
 * @see {mixer}
 * @see {mixerSuper}
 * @see {mixerInit}
 */
export function mixin<T extends Instanceable[]>(options: MixinOptions<T>): Function;
export function mixin<T extends Instanceable[]>(options: T | MixinOptions<T>) {
  if (!isPlainObject(options))
    options = {
      bases: options
    } as MixinOptions<T>;
  return function <R>(constructor: Instanceable<R>, context: ClassDecoratorContext) {
    mixinPrototype(constructor, (options as MixinOptions<T>).bases, (options as MixinOptions<T>).statics, (options as MixinOptions<T>).force)
  }
}

export interface Mixin<T> {}

export interface MixinConstructor extends WithPrototype<Mixin<any>> {
  new<T extends Instanceable[]>(...args: T[]): JoinInstanceableTypes<T>;
  /**
   * Mixin the properties names from bases prototypes to this prototype.
   * @see {mixinPrototype}
   *
   * @param bases Other classes references (or objects with a `prototype` object)
   * @param statics If true, it also mixes the static property names.  Default true.
   * @param force If true, if any value already exists for any property name in target, it will be replaced.
   * by the value of the last base with that property name.
   * @see {mixer}
   * @see {mixerSuper}
   * @see {mixerInit}
   */
  mix<I extends Instanceable[], T extends typeof Mixin<I>>(this: T, bases: I, statics?: boolean, force?: boolean): void;
}

/**
 * The mixin class.
 *
 * It facilitates the declaration of references to methods that are mixed to some class in typescript.
 * It is not mandatory to inherit from this class to make the prototype mixin.
 *
 * @example
 * // typescript code
 * class A {
 *   static sayStaticA() {
 *     console.log("Say static a")
 *   }
 *   sayA() {
 *     console.log("Say a")
 *   }
 * }
 *
 * class B {
 *   static sayStaticB() {
 *     console.log("Say static b")
 *   }
 *   sayB() {
 *     console.log("Say b")
 *   }
 * }
 *
 * type MixinCTypes = [typeof A, typeof B];
 * type MixinC = MixinProperties<typeof C, MixinCTypes>;
 * type MixinCStatics = MixinStatics<typeof C, MixinCTypes>;
 *
 * class C extends Mixin<MixinCTypes> {
 *   say() {
 *      console.log("Say")
 *   }
 *
 *   static sayStaticC() {
 *     console.log("Say static c")
 *   }
 *
 *   sayC() {
 *     console.log("Say c")
 *   }
 * }
 *
 * C.mix([A, B]); // This line is mandatory before using/instance the mixed class. And it must only be called once.
 * const c: MixinC = new C();
 * c.sayA(); // In typescript, if C did not inherit from Mixin<MixinCTypes>, this line would throw an error.
 * (C as MixinCStatics).sayStaticA();
 * @see {mixer}
 * @see {mixerSuper}
 * @see {mixerInit}
 */
export const Mixin: MixinConstructor = funclass({
  statics: {
    mix(bases, statics, force) {
      const $this = this;
      if (is($this.prototype.constructor, Mixin.prototype.constructor))
        throw new IllegalAccessError("The static function mix must be called from the class that inherits from Mixin.")
      mixinPrototype($this, bases, statics, force)
    }
  }
});

/**
 * Mixin the properties names from bases prototypes to the target prototype.
 *
 * @example
 * class A {
 *   static sayStatic() {
 *     console.log("Say static a")
 *   }
 *   say() {
 *     console.log("Say a")
 *   }
 * }
 *
 * class B {
 *   static sayStatic() {
 *     console.log("Say static b")
 *   }
 *   say() {
 *     console.log("Say b")
 *   }
 * }
 *
 * class C {
 *   say() {
 *      console.log("Say c")
 *   }
 *
 *   selfSay() {
 *     console.log("Say self c")
 *   }
 * }
 *
 * // no forces
 * mixinPrototype(C, [A, B]);
 * C.sayStatic(); // "Say static a"
 * const c = new C();
 * c.say(); // "Say c"
 *
 * // with forces
 * mixinPrototype(C, [A, B], true, true);
 * C.sayStatic(); // "Say static b"
 * const c = new C();
 * c.say(); // "Say b"
 *
 * @param target The class reference (or an object with a `prototype` object).
 * @param bases Other classes references (or objects with a `prototype` object)
 * @param statics If true, it also mixes the static property names.  Default true.
 * @param force If true, if any value already exists for any property name in target, it will be replaced.
 * by the value of the last base with that property name.
 * @see {mixer}
 * @see {mixerSuper}
 * @see {mixerInit}
 */
export function mixinPrototype<T extends Instanceable[]>(target: Instanceable, bases: T, statics?: boolean, force?: boolean) {
  if (isEmpty(bases))
    throw new RequiredArgumentError("The bases mixin constructors cannot be empty")
  if (hasOwn(target, mixinKey))
    return;

  const prototype = target.prototype;
  forEach(bases, cons => {
    const basePrototype = cons.prototype;
    // prototype methods
    forEach(propertyNames(basePrototype), name => {
      if (!call(includes, commonPrototype, name)) {
        if (!isDefined(prototype[name]) || force) {
          try {
            // safe assign for get/set functions
            prototype[name] = basePrototype[name];
          } catch (e) {
          }
        }
      }
    })

    if (!isDefined(statics) || statics) {
      // static methods
      forEach(propertyNames(cons), (name) => {
        if (!call(includes, commonStatics, name) && (!isDefined(get(target, name)) || force)) {
          try {
            // safe assign for get/set functions
            (target as KeyableObject)[name] = (cons as KeyableObject)[name];
          } catch (e) {
          }
        }
      })
    }
  })

  readonly(target, mixinKey, bases);
}

