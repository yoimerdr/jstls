import {
  IncludeThisParameter, Indeterminate,
  Instanceable,
  InstanceableFunction,
  InstanceableType, InstanceKeys,
  Keys, MethodKeys, SafeParameters, SafeReturnType,
} from "../index";
import {
  IndeterminatePrototype,
  KeyableObject,
  PrototypeType, ThisObjectKeys,
  WithPrototype
} from "../objects";
import {PropertyDescriptor, PropertyDescriptors} from "../objects/definer";

/**
 * Simple static methods without inheritance.
 *
 * Maps each key in type I to an optional method with 'this' parameter binding.
 * @template I - The type containing static methods.
 * @template T - Optional type to intersect with I for 'this' binding.
 */
export type FunctionClassSimpleStatics<I, T = void> =
  T extends Indeterminate ?
    {
      [K in Keys<I>]?: IncludeThisParameter<I[K], I, I[K]>;
    } :
    T extends IndeterminatePrototype ?
      FunctionClassSimpleStatics<I> :
      {
        [K in Keys<I>]?: IncludeThisParameter<I[K], I & T, I[K]>;
      };

/**
 * Static methods with inheritance support.
 *
 * Combines static methods from both child and parent classes if possible.
 * @template I - The type containing static methods.
 * @template P - The parent class type with prototype.
 */
export type FunctionClassStatics<I extends Instanceable, P extends WithPrototype = IndeterminatePrototype> =
  P extends Indeterminate ?
    FunctionClassSimpleStatics<I> :
    FunctionClassSimpleStatics<I, P> & FunctionClassSimpleStatics<P, I>;

/**
 * Simple prototype methods without inheritance.
 *
 * Maps instance methods to their corresponding types with proper 'this' binding.
 * @template I - The instanceable type containing prototype methods.
 * @template T - Optional type to intersect for 'this' binding.
 */
export type FunctionClassSimplePrototype<I extends Instanceable, T = void> =
  InstanceableType<I> extends Indeterminate ?
    never :
    FunctionClassSimpleStatics<InstanceableType<I>, T>

/**
 * Prototype methods with inheritance support.
 *
 * Combines prototype methods from both child and parent classes if possible.
 * @template I - The instanceable type containing prototype methods.
 * @template P - The parent class type with prototype.
 */
export type FunctionClassPrototype<I extends Instanceable, P extends WithPrototype = IndeterminatePrototype> =
  P extends IndeterminatePrototype ?
    FunctionClassSimplePrototype<I> :
    InstanceableType<I> extends Indeterminate ?
      never :
      FunctionClassSimplePrototype<I, PrototypeType<P>> &
      FunctionClassSimpleStatics<PrototypeType<P>, InstanceableType<I>>;

/**
 * Simple constructor function without inheritance.
 *
 * Defines constructor signature with proper 'this' binding.
 * @template I - The instanceable type to be constructed.
 * @template T - Optional type to intersect for 'this' binding.
 */
export type FunctionClassSimpleConstructorFunction<I extends Instanceable, T = void> =
  InstanceableType<I> extends Indeterminate ?
    never :
    InstanceableFunction<I> extends Indeterminate ?
      never :
      T extends Indeterminate ?
        IncludeThisParameter<InstanceableFunction<I>, InstanceableType<I>, InstanceableFunction<I>> :
        IncludeThisParameter<InstanceableFunction<I>, InstanceableType<I> & T, InstanceableFunction<I>>;

/**
 * Constructor function with inheritance support.
 *
 * Defines constructor signature considering parent class prototype.
 * @template I - The instanceable type to be constructed
 * @template P - The parent class type with prototype
 */
export type FunctionClassConstructorFunction<I extends Instanceable, P extends WithPrototype = IndeterminatePrototype> =
  P extends Indeterminate ?
    FunctionClassSimpleConstructorFunction<I> :
    PrototypeType<P> extends Indeterminate ?
      FunctionClassSimpleConstructorFunction<I> :
      FunctionClassSimpleConstructorFunction<I, PrototypeType<P>>;

export interface FunctionClassConstructor<T, P extends any[] = any[]> {
  new(...args: P): T;

  (...args: P): T;

  readonly prototype: T;
}

export type FunctionClassProtoDescriptor<I extends Instanceable, P extends WithPrototype = IndeterminatePrototype> =
  InstanceableType<I> extends Indeterminate ?
    never :
    PrototypeType<P> extends Indeterminate ?
      Partial<PropertyDescriptors<InstanceableType<I>>> :
      {
        [K in InstanceKeys<I>]?: PropertyDescriptor<InstanceableType<I>, K> &
        {
          get?(this: InstanceableType<I> & PrototypeType<P>,): InstanceableType<I>[K];
          set?(this: InstanceableType<I> & PrototypeType<P>, value: InstanceableType<I>[K]): void;
        }
      };

/**
 * Base function class options.
 *
 * Contains common configuration options for class definition.
 * @template I - The instanceable type being defined
 * @template P - The parent class type with prototype
 */
export interface FunctionClassOptions<I extends Instanceable, P extends WithPrototype = IndeterminatePrototype> {
  /**
   * Static methods and properties.
   */
  statics?: Omit<FunctionClassStatics<I, P>, "prototype">
  /**
   * Descriptors for static members.
   */
  statidescriptor?: KeyableObject<PropertyDescriptor & ThisType<I>>;
  /**
   * Descriptors for prototype members.
   */
  protodescriptor?: FunctionClassProtoDescriptor<I, P>;

  cls?: FunctionClassClsBuilder<I, P>;

  /**
   * Class constructor function.
   */
  construct?: FunctionClassConstructorFunction<I, P>;

  /**
   * Prototype methods and properties
   */
  prototype?: FunctionClassPrototype<I, P>
}

/**
 * Simple function class builder without inheritance.
 *
 * Function that returns the function class options.
 * @template I - The instanceable type being defined
 */
export type FunctionClassSimpleBuilder<I extends Instanceable> = () => FunctionClassOptions<I, IndeterminatePrototype>;

/**
 * Function class builder with inheritance support.
 *
 * Function that accepts super bindings and returns class configuration.
 * @template I - The instanceable type being defined
 * @template P - The parent class type with prototype
 * @param properties - Super bindings for prototype methods
 * @param statics - Super bindings for static methods
 */
export type FunctionClassBuilder<I extends Instanceable, P extends WithPrototype = IndeterminatePrototype> = (properties: FunctionClassSuper<PrototypeType<P>>, statics: FunctionClassSuper<P>) =>
  FunctionClassOptions<I, P>;

/**
 * Super methods that can be called from child classes.
 *
 * Maps method names to bound function signatures with a `this` as the first parameter.
 * @template T - The type containing the super methods
 */
export type FunctionClassSuper<T, > = {
  [K in MethodKeys<T>]: (thisArg: T, ...args: SafeParameters<T[K]>) => SafeReturnType<T[K]>
}

export type FunctionClassClsBuilder<I extends Instanceable, P extends WithPrototype = IndeterminatePrototype> =
  InstanceableType<I> extends Indeterminate ?
    never :
    PrototypeType<P> extends Indeterminate ?
      (constructor: FunctionClassConstructorFunction<I>) => FunctionClassConstructorFunction<I, P> :
      (constructor: FunctionClassConstructorFunction<I, P>, parent: P) => FunctionClassConstructorFunction<I, P>;

/**
 * ES5 class options.
 *
 * Simplified options type for basic function class definitions.
 * @template T - The class type being defined
 * @template I - The instanceable type
 */
export interface ES5ClassOptions<T, I extends Instanceable = any> {
  statics?: Partial<ThisObjectKeys<I>>
  statidescriptor?: KeyableObject<PropertyDescriptor & ThisType<I>>;
  prototype: Partial<ThisObjectKeys<T>>;
  protodescriptor?: KeyableObject<PropertyDescriptor> & ThisType<T>;
}
