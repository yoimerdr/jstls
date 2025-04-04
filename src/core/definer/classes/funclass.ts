import {Instanceable, InstanceableType, MethodKeys, Nullables} from "../../../types/core";
import {
  FunctionClassBuilder,
  FunctionClassOptions,
  FunctionClassSimpleBuilder,
  FunctionClassSuper
} from "../../../types/core/definer";
import {call} from "../../functions/call";
import {reduce} from "../../iterable";
import {IndeterminatePrototype, KeyableObject, PrototypeType, WithPrototype} from "../../../types/core/objects";
import {keys, methodProperties, propertyNames} from "../../objects/handlers/properties";
import {props} from "../props";
import {prototype} from "../../extender/prototype";
import {includes} from "../../polyfills/indexable/es2016";
import {descriptor} from "../shared";
import {isDefined, isFunction, isPlainObject} from "../../objects/types";
import {createSuper, parentFirst} from "./supers";
import {indefinite} from "../../utils/types";
import {self} from "../getters/builders";

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
  let options: FunctionClassOptions<I, P>,
    acceptedTypes = ["object", "function"];

  if (isPlainObject(builder)) {
    options = builder as FunctionClassOptions<I, P>;
  } else {
    if (!isFunction(builder))
      throw TypeError("The builder must be a function.");
    // build the super handlers
    let sProperties: FunctionClassSuper<PrototypeType<P>>, sStatics: FunctionClassSuper<P> = sProperties = indefinite!;

    if (parent && !withoutSupers) {
      if (!call(includes, acceptedTypes, typeof parent))
        throw TypeError("The parent must be an object or function.");

      const staticNames = methodProperties(parent, 'statics'),
        prototype = parent.prototype,
        propertyNames = methodProperties(prototype, 'prototype') as MethodKeys<InstanceableType<I>>[];

      sStatics = createSuper(staticNames, parent)!;
      sProperties = createSuper(propertyNames, prototype)!;
    }
    options = (builder as FunctionClassBuilder<I, P>)(sProperties, sStatics);
  }


  // build options and unpack
  const {statics, statidescriptor, protodescriptor, prototype: proto} = options;

  let {construct: init, cls: clsBuilder} = options,
    constructor = init;

  // check constructor
  clsBuilder = clsBuilder! || parentFirst;

  if (!isFunction(clsBuilder))
    throw TypeError("The modified constructor builder must be a function.");

  const cls = clsBuilder(constructor!, parent!);

  // check passed constructor
  if (isDefined(init) && !isFunction(init))
    throw TypeError("The constructor must be a function.");
  if (isDefined(cls) && !isFunction(cls))
    throw TypeError("The modified constructor must be a function.");

  init = cls || init || self();

  // assign parent methods/prototype first
  parent && prototype(init, parent);

  // assign statics
  statidescriptor && props(init, statidescriptor);
  statics && props(init, sourceToDescriptor(statics));

  console.log(builder, init, init!.prototype || (builder as KeyableObject).construct.prototype);
  const funPrototype = init.prototype;
  if (!call(includes, acceptedTypes, typeof funPrototype))
    throw TypeError("The function prototype must be an object.");

  // assign prototype properties
  protodescriptor && props(funPrototype, protodescriptor as any);
  proto && props(funPrototype, sourceToDescriptor(proto));

  return init as any;
}
