import {FunctionClassConstructor} from "../../types/core/definer";
import {funclass2} from "../definer/classes/funclass";

/**
 * Define a new exception class function.
 * @param name The name of the exception.
 * @param parent The parent error (default `Error`).
 */
export function defineException<T extends FunctionClassConstructor<Error, [message?: string]>>(name: string, parent?: T): T {
  return funclass2<ErrorConstructor>({
    construct: function () {
      this.name = name;
    }
  }, parent || Error) as T;
}
