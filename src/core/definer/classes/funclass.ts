import {Instanceable, InstanceableType, MethodKeys, Nullables} from "@jstls/types/core";
import {
  FunctionClassBuilder,
  FunctionClassOptions,
  FunctionClassSimpleBuilder,
  FunctionClassSuper
} from "@jstls/types/core/definer";
import {call} from "@jstls/core/functions/call";
import {reduce} from "@jstls/core/iterable";
import {IndeterminatePrototype, KeyableObject, PrototypeType, WithPrototype} from "@jstls/types/core/objects";
import {keys, methodProperties} from "@jstls/core/objects/handlers/properties";
import {props} from "@jstls/core/definer/props";
import {prototype} from "@jstls/core/extender/prototype";
import {includes} from "@jstls/core/polyfills/indexable/es2016";
import {descriptor} from "@jstls/core/definer/shared";
import {isDefined, isFunction, isPlainObject} from "@jstls/core/objects/types";
import {createSuper, parentFirst} from "./supers";
import {indefinite} from "@jstls/core/utils/types";
import {self} from "@jstls/core/definer/getters/builders";

const acceptedTypes = ["object", "function"],
  Exception = TypeError

export function sourceToDescriptor(source: KeyableObject): KeyableObject<PropertyDescriptor> {
  return reduce(keys(source), (current, key) => {
    current[key] = descriptor(source[key], true, true, false)
    return current;
  }, <KeyableObject<PropertyDescriptor>>{})
}

/**
 * Creates a function to behave as a class constructor with inheritance capabilities.
 * @param options The class configuration
 * @returns The constructor function
 */
export function funclass<I extends Instanceable>(options: FunctionClassOptions<I, IndeterminatePrototype>,): I;
/**
 * Creates a function to behave as a class constructor with inheritance capabilities.
 * @param options The class configuration
 * @param parent Parent class to inherit from
 * @returns The constructor function
 */
export function funclass<I extends Instanceable, P extends WithPrototype>(options: FunctionClassOptions<I, P>, parent: P): I;
/**
 * Creates a function to behave as a class constructor with inheritance capabilities.
 * @param options The class configuration
 * @param parent Parent class to inherit from
 * @returns The constructor function
 */
export function funclass<I extends Instanceable>(options: FunctionClassOptions<I, IndeterminatePrototype>, parent: WithPrototype): I;
/**
 * Creates a function to behave as a class constructor with inheritance capabilities.
 * @param options The class configuration
 * @param parent Parent class to inherit from
 * @returns The constructor function
 */
export function funclass<I extends Instanceable>(options: FunctionClassOptions<I, IndeterminatePrototype>, parent: WithPrototype): I;

/**
 * Creates a function to behave as a class constructor with inheritance capabilities.
 * @param builder Function that builds and returns the class configuration
 * @returns The constructor function
 */
export function funclass<I extends Instanceable>(builder: FunctionClassSimpleBuilder<I>,): I;
/**
 * Creates a function to behave as a class constructor with inheritance capabilities.
 * @param builder Function that builds and returns the class configuration
 * @param parent Parent class to inherit from
 * @returns The constructor function
 */
export function funclass<I extends Instanceable, P extends WithPrototype>(builder: FunctionClassBuilder<I, P>, parent: P): I;
/**
 * Creates a function to behave as a class constructor with inheritance capabilities.
 * @param builder Function that builds and returns the class configuration
 * @param parent Parent class to inherit from
 * @returns The constructor function
 */
export function funclass<I extends Instanceable, >(builder: FunctionClassSimpleBuilder<I>, parent: WithPrototype): I;
/**
 * Creates a function to behave as a class constructor with inheritance capabilities.
 * @param builder Function that builds and returns the class configuration
 * @param parent Parent class to inherit from
 * @returns The constructor function
 */
export function funclass<I extends Instanceable, >(builder: FunctionClassSimpleBuilder<I>, parent: WithPrototype): I;
/**
 * Creates a function to behave as a class constructor with inheritance capabilities.
 * @param builder Function that builds and returns the class configuration
 * @param parent Parent class to inherit from
 * @returns The constructor function
 */
export function funclass<I extends Instanceable, >(builder: FunctionClassSimpleBuilder<I>, parent: Nullables): I;
/**
 * Creates a function to behave as a class constructor with inheritance capabilities.
 * @param builder Function that builds and returns the class configuration
 * @param parent Parent class to inherit from
 * @param withoutSupers If true, skips creating super method bindings
 * @returns The constructor function
 */
export function funclass<I extends Instanceable, P extends WithPrototype>(builder: FunctionClassSimpleBuilder<I>, parent: P, withoutSupers: true): I;
export function funclass<I extends Instanceable, P extends WithPrototype>(builder: FunctionClassBuilder<I, P>, parent: P, withoutSupers: false): I;
export function funclass<I extends Instanceable, P extends WithPrototype>(builder: KeyableObject | (() => KeyableObject),
                                                                          parent?: P, withoutSupers?: boolean): I {
  let options: FunctionClassOptions<I, P>;

  if (isPlainObject(builder)) {
    options = builder as FunctionClassOptions<I, P>;
  } else {
    if (!isFunction(builder))
      throw Exception("The builder must be a function.");
    // build the super handlers
    let sProperties: FunctionClassSuper<PrototypeType<P>>, sStatics: FunctionClassSuper<P> = sProperties = indefinite!;

    if (parent && !withoutSupers) {
      if (!call(includes, acceptedTypes, typeof parent))
        throw Exception("The parent must be an object or function.");

      const staticNames = methodProperties(parent, 'statics'),
        prototype = parent.prototype,
        propertyNames = methodProperties(prototype, 'prototype') as MethodKeys<InstanceableType<I>>[];

      sStatics = createSuper(staticNames, parent)!;
      sProperties = createSuper(propertyNames, prototype)!;
    }
    options = (builder as FunctionClassBuilder<I, P>)(sProperties, sStatics);
  }

  return funclass2(options as any, parent!);
}

/**
 * Creates a function to behave as a class constructor with inheritance capabilities.
 * @param options The class configuration
 * @returns The constructor function
 */
export function funclass2<I extends Instanceable>(options: FunctionClassOptions<I, IndeterminatePrototype>,): I;
/**
 * Creates a function to behave as a class constructor with inheritance capabilities.
 * @param options The class configuration
 * @param parent Parent class to inherit from
 * @returns The constructor function
 */
export function funclass2<I extends Instanceable, P extends WithPrototype>(options: FunctionClassOptions<I, P>, parent: P): I;
/**
 * Creates a function to behave as a class constructor with inheritance capabilities.
 * @param options The class configuration
 * @param parent Parent class to inherit from
 * @returns The constructor function
 */
export function funclass2<I extends Instanceable>(options: FunctionClassOptions<I, IndeterminatePrototype>, parent: WithPrototype): I;
/**
 * Creates a function to behave as a class constructor with inheritance capabilities.
 * @param options The class configuration
 * @param parent Parent class to inherit from
 * @returns The constructor function
 */
export function funclass2<I extends Instanceable>(options: FunctionClassOptions<I, IndeterminatePrototype>, parent: WithPrototype): I;

export function funclass2<I extends Instanceable, P extends WithPrototype>(options: KeyableObject,
                                                                           parent?: P): I {
  // build options and unpack
  const {statics, statidescriptor, protodescriptor, prototype: proto} = options;

  let {construct: init, cls: clsBuilder} = options,
    constructor = init;

  // check constructor
  clsBuilder = clsBuilder! || parentFirst;

  if (!isFunction(clsBuilder))
    throw Exception("The modified constructor builder must be a function.");

  const cls = clsBuilder(constructor!, parent!);

  // check passed constructor
  if (isDefined(init) && !isFunction(init))
    throw Exception("The constructor must be a function.");
  if (isDefined(cls) && !isFunction(cls))
    throw Exception("The modified constructor must be a function.");

  init = cls || init || self();

  // assign parent methods/prototype first
  parent && prototype(init, parent);

  // assign statics
  statidescriptor && props(init, statidescriptor);
  statics && props(init, sourceToDescriptor(statics));

  const funPrototype = init.prototype;
  if (!call(includes, acceptedTypes, typeof funPrototype))
    throw Exception("The function prototype must be an object.");

  // assign prototype properties
  protodescriptor && props(funPrototype, protodescriptor as any);
  proto && props(funPrototype, sourceToDescriptor(proto));

  return init as any;
}
