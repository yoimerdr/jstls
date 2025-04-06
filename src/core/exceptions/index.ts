import {funclass} from "../definer/classes/funclass";
import {FunctionClassConstructor} from "../../types/core/definer";
import {WithPrototype} from "../../types/core/objects";


interface ErrorConstructor<T extends Error> extends WithPrototype<T> {
  new(message?: string): T;

  (message?: string): T;
}

export interface IllegalAccessError extends Error {
}

export interface IllegalAccessErrorConstructor extends ErrorConstructor<IllegalAccessError> {
}

export const IllegalAccessError: IllegalAccessErrorConstructor = funclass({
  construct: function () {
    this.name = "IllegalAccessError";
  }
}, Error)


export interface IllegalArgumentError extends Error {
}

export interface IllegalArgumentErrorConstructor extends ErrorConstructor<IllegalArgumentError> {
}

export const IllegalArgumentError: IllegalArgumentErrorConstructor = funclass({
  construct: function () {
    this.name = "IllegalArgumentError";
  }
}, Error)

export interface RequiredArgumentError extends Error {
}

export interface RequiredArgumentErrorConstructor extends ErrorConstructor<IllegalArgumentError> {
}

export const RequiredArgumentError: RequiredArgumentErrorConstructor = funclass<FunctionClassConstructor<RequiredArgumentError>>({
  construct: function () {
    this.name = "RequiredArgumentError";
  }
}, Error)



