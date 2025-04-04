interface CreateShortcut {
  /**
   * Creates an object that has the specified prototype or that has null prototype.
   *
   * This is a short for {@link Object.create}.
   * @param o Object to use as a prototype. May be null.
   * @see {Object.create}
   */
  (o: object | null): any;

  /**
   * Creates an object that has the specified prototype, and that optionally contains specified properties.
   *
   * This is a short for {@link Object.create}.
   * @param o Object to use as a prototype. May be null
   * @param properties JavaScript object that contains one or more property descriptors.
   * @see {Object.create}
   */
  (o: object | null, properties: PropertyDescriptorMap & ThisType<any>): any;
}

interface DefinePropertyShortcut {
  /**
   * Adds a property to an object, or modifies attributes of an existing property.
   *
   * This is a short for {@link Object.defineProperty}.
   * @param o Object on which to add or modify the property. This can be a native JavaScript object (that is, a user-defined object or a built in object) or a DOM object.
   * @param p The property name.
   * @param attributes Descriptor for the property. It can be for a data property or an accessor property.
   * @see {Object.defineProperty}
   */<T>(o: T, p: PropertyKey, attributes: PropertyDescriptor & ThisType<any>): T;
}

interface DefinePropertiesShortcut {
  /**
   * Adds one or more properties to an object, and/or modifies attributes of existing properties.
   *
   * This is a short for {@link Object.defineProperties}.
   * @param o Object on which to add or modify the properties. This can be a native JavaScript object or a DOM object.
   * @param properties JavaScript object that contains one or more descriptor objects. Each descriptor object describes a data property or an accessor property.
   * @see {Object.defineProperties}
   */<T>(o: T, properties: PropertyDescriptorMap & ThisType<any>): T;
}

interface FreezeShortcut {
  /**
   * Prevents the modification of existing property attributes and values, and prevents the addition of new properties.
   *
   * This is a short for {@link Object.freeze}.
   * @param f Object on which to lock the attributes.
   * @see {Object.freeze}
   */<T extends Function>(f: T): T;

  /**
   * Prevents the modification of existing property attributes and values, and prevents the addition of new properties.
   *
   * This is a short for {@link Object.freeze}.
   * @param o Object on which to lock the attributes.
   * @see {Object.freeze}
   */<T extends {
    [idx: string]: U | null | undefined | object;
  }, U extends string | bigint | number | boolean | symbol>(o: T): Readonly<T>;

  /**
   * Prevents the modification of existing property attributes and values, and prevents the addition of new properties.
   *
   * This is a short for {@link Object.freeze}.
   * @param o Object on which to lock the attributes.
   * @see {Object.freeze}
   */<T>(o: T): Readonly<T>;
}

export const create: CreateShortcut = Object.create;

export const defineProperty: DefinePropertyShortcut = Object.defineProperty;

export const defineProperties: DefinePropertiesShortcut = Object.defineProperties;

export const freeze: FreezeShortcut = Object.freeze;

export function valueOf<T extends { valueOf(): any },>(object: T): ReturnType<T["valueOf"]> {
  return object.valueOf();
}

