import {FunctionClassConstructor} from "@/types/core/definer";
import {funclass2} from "@/core/definer/classes/funclass";
import {WithPrototype} from "@/types/core/objects";

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
