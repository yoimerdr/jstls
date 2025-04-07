import {WithPrototype} from "../../types/core/objects";
import {defineException} from "./shared";


interface ErrorConstructor<T extends Error> extends WithPrototype<T> {
  new(message?: string): T;

  (message?: string): T;
}

export interface IllegalAccessError extends Error {
}

export interface IllegalAccessErrorConstructor extends ErrorConstructor<IllegalAccessError> {
}

export const IllegalAccessError: IllegalAccessErrorConstructor = defineException("IllegalAccessError");


export interface IllegalArgumentError extends Error {
}

export interface IllegalArgumentErrorConstructor extends ErrorConstructor<IllegalArgumentError> {
}

export const IllegalArgumentError: IllegalArgumentErrorConstructor = defineException("IllegalArgumentError")

export interface RequiredArgumentError extends Error {
}

export interface RequiredArgumentErrorConstructor extends ErrorConstructor<IllegalArgumentError> {
}

export const RequiredArgumentError: RequiredArgumentErrorConstructor = defineException("RequiredArgumentError")



