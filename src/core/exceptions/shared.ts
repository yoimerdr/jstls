import {FunctionClassConstructor} from "@jstls/types/core/definer";
import {funclass2} from "@jstls/core/definer/classes/funclass";
import {WithPrototype} from "@jstls/types/core/objects";

export interface ErrorConstructor<T extends Error> extends WithPrototype<T> {
  new(message?: string): T;

  (message?: string): T;
}

/**
 * Define a new exception class function.
 * @param name The name of the exception.
 * @param parent The parent error (default `Error`).
 */
export function defineException<T extends FunctionClassConstructor<Error, [message?: string]>>(name: string, parent?: T): T {
  return funclass2<ErrorConstructor<Error>>({
    construct: function () {
      this.name = name;
    }
  }, parent || Error) as T;
}
